import { NextResponse } from "next/server";
import OpenAI from "openai";
import { modeConfigs } from "@/lib/mode-config";
import { type ModeType } from "@/lib/colors";
import {
  formatWorkoutPlanMessage,
  type WorkoutPlan,
  type WorkoutType,
  commonWarmups,
  commonCooldowns,
  workoutQuestions,
} from "@/lib/workout-templates";
import {
  isStreakRequest,
  formatStreakMessage,
  type StreakData,
  type StreakDisplay,
} from "@/lib/streak-templates";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Modes that should use chat-like behavior
const CHAT_LIKE_MODES = ["bff", "girlfriend"];

// Add constants for model names at the top
const OPENAI_MODEL = "gpt-4o-mini"; // Points to gpt-4o-mini-2024-07-18
const OPENAI_VISION_MODEL = "gpt-4o"; // Points to gpt-4o-2024-08-06

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

async function handleWorkoutRequest(
  message: string,
  history: any[]
): Promise<string> {
  // If this is the initial workout request, start the flow
  if (isWorkoutRequest(message)) {
    return workoutQuestions.initial;
  }

  // Check if we're in the middle of a workout flow
  const lastAssistantMessage = [...history]
    .reverse()
    .find((msg) => msg.role === "assistant")?.content;

  if (lastAssistantMessage === workoutQuestions.initial) {
    // User is selecting muscle group
    const muscleGroup = message.toLowerCase();
    if (
      ![
        "legs",
        "arms",
        "chest",
        "back",
        "shoulders",
        "core",
        "cardio",
        "full-body",
      ].includes(muscleGroup)
    ) {
      return "I didn't catch that. Please choose one of: legs, arms, chest, back, shoulders, core, cardio, or full-body.";
    }
    return workoutQuestions.difficulty;
  }

  if (lastAssistantMessage === workoutQuestions.difficulty) {
    // User is selecting difficulty
    const difficulty = message.toLowerCase();
    if (!["beginner", "intermediate", "advanced"].includes(difficulty)) {
      return "Please specify your level as beginner, intermediate, or advanced.";
    }
    return workoutQuestions.duration;
  }

  if (lastAssistantMessage === workoutQuestions.duration) {
    // User specified duration, ask about equipment
    return workoutQuestions.equipment;
  }

  if (lastAssistantMessage === workoutQuestions.equipment) {
    // We have all the info, generate the workout plan
    const muscleGroup = history
      .find(
        (msg) =>
          msg.role === "user" &&
          [
            "legs",
            "arms",
            "chest",
            "back",
            "shoulders",
            "core",
            "cardio",
            "full-body",
          ].includes(msg.content.toLowerCase())
      )
      ?.content.toLowerCase();
    const difficulty = history
      .find(
        (msg) =>
          msg.role === "user" &&
          ["beginner", "intermediate", "advanced"].includes(
            msg.content.toLowerCase()
          )
      )
      ?.content.toLowerCase();
    const duration = history.find(
      (msg) =>
        msg.role === "user" &&
        history[history.indexOf(msg) - 1].content === workoutQuestions.duration
    )?.content;
    const equipment = message;

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a fitness expert. Generate a workout plan based on the user's preferences. Return ONLY valid JSON matching the WorkoutPlan type with no additional text.",
        },
        {
          role: "user",
          content: `Create a ${difficulty} level ${muscleGroup} workout that takes ${duration}. Equipment available: ${equipment}`,
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
    const plan = {
      ...workoutPlan,
      warmup: [
        ...(commonWarmups[workoutPlan.type === "legs" ? "legs" : "upper"] ||
          commonWarmups.general),
      ],
      cooldown: [...commonCooldowns],
    };

    return formatWorkoutPlanMessage(plan);
  }

  // If we get here, something went wrong with the flow
  return "I lost track of our conversation. Let's start over! What type of workout would you like?";
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

async function handleStreakRequest(): Promise<StreakDisplay> {
  // In a real app, this would fetch from a database
  // For now, we'll return mock data
  const mockStreak: StreakData = {
    currentStreak: 7,
    longestStreak: 14,
    lastActive: new Date().toISOString(),
    streakStartDate: new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000
    ).toISOString(),
    totalDays: 21,
    milestones: {
      nextMilestone: 14,
      progress: Math.round((7 / 14) * 100),
    },
  };

  return {
    type: "streak",
    data: mockStreak,
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const message = formData.get("message") as string;
    const mode = formData.get("mode") as string;
    const history = JSON.parse(formData.get("history") as string);
    const file = formData.get("file") as File | null;

    if (!message && !file) {
      return NextResponse.json(
        { error: "Message or file is required" },
        { status: 400 }
      );
    }

    const modeConfig = modeConfigs[mode];
    if (!modeConfig) {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    // Handle image processing with vision model
    if (file) {
      try {
        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString("base64");
        const mimeType = file.type;

        // Prepare system message based on mode
        const systemMessage = `${modeConfig.systemPrompt}

Personality traits: ${modeConfig.personality}

When analyzing images:
1. Be detailed but concise
2. Stay in character and maintain your persona's style
3. If you notice any text in the image, mention it
4. If you notice any people, describe them appropriately
5. If asked about specific aspects, focus on those
6. Keep responses engaging and natural`;

        const completion = await openai.chat.completions.create({
          model: OPENAI_VISION_MODEL,
          messages: [
            {
              role: "system",
              content: systemMessage,
            },
            ...history.slice(-5), // Only include last 5 messages for context
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: message || "What do you see in this image?",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType};base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        });

        const response = completion.choices[0].message.content;
        if (!response) {
          throw new Error("No response generated");
        }

        return new Response(response, {
          headers: {
            "Content-Type": "text/plain",
          },
        });
      } catch (error) {
        console.error("Image processing error:", error);
        return NextResponse.json(
          { error: "Failed to process image: " + (error as Error).message },
          { status: 500 }
        );
      }
    }

    // Handle streak requests
    if (isStreakRequest(message)) {
      const streakTemplate = await handleStreakRequest();
      return NextResponse.json(streakTemplate);
    }

    // Special handling for workout requests in coach mode
    if (mode === "coach" && isWorkoutRequest(message)) {
      const workoutPlan = await handleWorkoutRequest(message, history);
      return new Response(workoutPlan, {
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
      model: OPENAI_MODEL,
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
