import { NextResponse } from "next/server";
import OpenAI from "openai";
import { modeConfigs } from "@/lib/mode-config";
import { type ModeType } from "@/lib/colors";
import {
  formatWorkoutToMarkdown,
  type WorkoutPlan,
  type WorkoutType,
  commonWarmups,
  commonCooldowns,
} from "@/lib/workout-templates";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Modes that should use chat-like behavior
const CHAT_LIKE_MODES = ["bff", "girlfriend"];

// Function to detect workout request
function isWorkoutRequest(text: string): boolean {
  const workoutKeywords = [
    "workout",
    "exercise",
    "training",
    "routine",
    "exercises",
    "workouts",
    "program",
  ];
  const questionWords = ["what", "give", "create", "suggest", "plan", "help"];

  const lowercaseText = text.toLowerCase();
  return (
    workoutKeywords.some((keyword) => lowercaseText.includes(keyword)) &&
    questionWords.some((word) => lowercaseText.includes(word))
  );
}

// Function to detect if text represents a natural break in conversation
function isNaturalBreak(text: string): boolean {
  // Check for sentence endings with a period
  if (text.trim().match(/[.!?]$/)) return true;

  // Check for natural breaks with emojis
  if (text.match(/[😊😄😃😀🤔💭💡🎉]\s*$/)) return true;

  // Check for line breaks
  if (text.includes("\n\n")) return true;

  return false;
}

async function handleWorkoutRequest(message: string): Promise<WorkoutPlan> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content:
          "You are a fitness expert. Generate a workout plan based on the user's request. Return ONLY valid JSON matching the WorkoutPlan type with no additional text.",
      },
      {
        role: "user",
        content: `Create a workout plan for: ${message}. Include appropriate warmup and cooldown exercises. Make it challenging but achievable.`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  if (!completion.choices[0].message.content) {
    throw new Error("No workout plan generated");
  }

  const workoutPlan = JSON.parse(
    completion.choices[0].message.content
  ) as WorkoutPlan;
  return {
    ...workoutPlan,
    warmup: [
      ...(commonWarmups[workoutPlan.type === "legs" ? "legs" : "upper"] ||
        commonWarmups.general),
    ],
    cooldown: [...commonCooldowns],
  };
}

async function handleChatLikeMode(
  completion: any,
  controller: ReadableStreamDefaultController
) {
  let currentChunk = "";
  let lastChunkTime = Date.now();

  for await (const chunk of completion) {
    const content = chunk.choices[0]?.delta?.content || "";
    currentChunk += content;

    // Split on natural breaks or when chunk gets too long
    if (
      (currentChunk.length > 15 && isNaturalBreak(currentChunk)) ||
      currentChunk.length > 150
    ) {
      if (currentChunk.trim()) {
        // Shorter delay for more responsive feel
        const timeSinceLastChunk = Date.now() - lastChunkTime;
        const delay = Math.max(150, 300 - timeSinceLastChunk);

        if (timeSinceLastChunk < delay) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }

        controller.enqueue(currentChunk.trim() + "\n---CHUNK---\n");
        currentChunk = "";
        lastChunkTime = Date.now();
      }
    }
  }

  // Send any remaining content
  if (currentChunk.trim()) {
    controller.enqueue(currentChunk.trim() + "\n---CHUNK---\n");
  }
}

async function handleRegularMode(
  completion: any,
  controller: ReadableStreamDefaultController
) {
  try {
    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        // For regular streaming, we don't add any special markers
        controller.enqueue(content);
      }
    }
  } catch (error) {
    console.error("Streaming error:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { message, mode, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const modeConfig = modeConfigs[mode];
    if (!modeConfig) {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    // Special handling for workout requests in coach mode
    if (mode === "coach" && isWorkoutRequest(message)) {
      const workoutPlan = await handleWorkoutRequest(message);
      const formattedWorkout = formatWorkoutToMarkdown(workoutPlan);

      return new Response(formattedWorkout, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    const isChatLike = CHAT_LIKE_MODES.includes(mode);
    const systemPrompt = isChatLike
      ? `${modeConfig.systemPrompt}\n\nPersonality traits: ${modeConfig.personality}\n\nImportant: Write naturally and conversationally. Use emojis occasionally. Keep responses concise and engaging.`
      : `${modeConfig.systemPrompt}\n\nPersonality traits: ${modeConfig.personality}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...history,
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
      stream: true,
    });

    if (isChatLike) {
      const stream = new ReadableStream({
        async start(controller) {
          await handleChatLikeMode(completion, controller);
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } else {
      // For regular modes, stream the response directly
      const stream = new ReadableStream({
        async start(controller) {
          await handleRegularMode(completion, controller);
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 }
    );
  }
}
