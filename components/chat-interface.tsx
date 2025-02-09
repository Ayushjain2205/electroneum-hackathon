"use client";

import { useState, useRef, useEffect } from "react";
import { Message } from "./message";
import { ChatInput } from "./chat-input";
import { VoiceInterface } from "./voice-interface";
import { useMode } from "@/contexts/ModeContext";
import { modeConfigs } from "@/lib/mode-config";
import { useToast } from "@/hooks/use-toast";
import { type ModeType } from "@/lib/colors";
import { type StreakDisplay } from "@/lib/streak-templates";

interface ChatMessage {
  id: number;
  content: string | StreakDisplay;
  isUser: boolean;
  attachment?: {
    type: "image";
    url: string;
  };
}

// Modes that should use chat-like behavior
const CHAT_LIKE_MODES = ["bff", "girlfriend"];

export function ChatInterface() {
  const { activeMode, activeColor, activeLighterColor } = useMode();
  const { toast } = useToast();
  const [messagesByMode, setMessagesByMode] = useState<
    Record<ModeType, ChatMessage[]>
  >(() => {
    // Initialize with welcome messages for each mode
    const initialMessages: Record<ModeType, ChatMessage[]> = {} as Record<
      ModeType,
      ChatMessage[]
    >;
    Object.keys(modeConfigs).forEach((mode) => {
      initialMessages[mode as ModeType] = [
        {
          id: Date.now() + Math.random(),
          content: modeConfigs[mode].welcomeMessage,
          isUser: false,
        },
      ];
    });
    return initialMessages;
  });

  const [isCallMode, setIsCallMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousMode = useRef<ModeType>(activeMode);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesByMode[activeMode]]);

  // Handle mode changes
  useEffect(() => {
    if (previousMode.current !== activeMode) {
      previousMode.current = activeMode;
      scrollToBottom();
    }
  }, [activeMode]);

  const handleSendMessage = async (content: string, attachment?: File) => {
    const isChatLike = CHAT_LIKE_MODES.includes(activeMode);

    // Add user message immediately
    setMessagesByMode((prev) => ({
      ...prev,
      [activeMode]: [
        ...prev[activeMode],
        {
          id: Date.now(),
          content,
          isUser: true,
          attachment: attachment
            ? {
                type: "image",
                url: URL.createObjectURL(attachment),
              }
            : undefined,
        },
      ],
    }));
    setIsLoading(true);
    setIsStreaming(false);

    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append("message", content);
      formData.append("mode", activeMode);

      // Convert history to a format that doesn't include local image URLs
      const sanitizedHistory = messagesByMode[activeMode].map((msg) => ({
        role: msg.isUser ? "user" : "assistant",
        content:
          typeof msg.content === "string"
            ? msg.content
            : JSON.stringify(msg.content),
      }));
      formData.append("history", JSON.stringify(sanitizedHistory));

      if (attachment) {
        formData.append("file", attachment);
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const contentType = response.headers.get("content-type");

      // Handle different response types
      if (contentType?.includes("application/json")) {
        const templateData = await response.json();
        setMessagesByMode((prev) => ({
          ...prev,
          [activeMode]: [
            ...prev[activeMode],
            { id: Date.now(), content: templateData, isUser: false },
          ],
        }));
        setIsLoading(false);
        return;
      }

      if (isChatLike && contentType?.includes("text/event-stream")) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        if (!reader) {
          throw new Error("No reader available");
        }

        setIsStreaming(true);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const chunks = buffer.split("\n---CHUNK---\n");

          // Process all complete chunks except the last one (which might be incomplete)
          for (let i = 0; i < chunks.length - 1; i++) {
            const chunk = chunks[i].trim();
            if (chunk) {
              setMessagesByMode((prev) => ({
                ...prev,
                [activeMode]: [
                  ...prev[activeMode],
                  {
                    id: Date.now() + Math.random(),
                    content: chunk,
                    isUser: false,
                  },
                ],
              }));
            }
          }

          // Keep the last chunk in the buffer as it might be incomplete
          buffer = chunks[chunks.length - 1];
        }

        // Process any remaining content in the buffer
        if (buffer.trim()) {
          setMessagesByMode((prev) => ({
            ...prev,
            [activeMode]: [
              ...prev[activeMode],
              {
                id: Date.now() + Math.random(),
                content: buffer.trim(),
                isUser: false,
              },
            ],
          }));
        }
      } else {
        // For text responses (including vision model responses)
        const textResponse = await response.text();
        setMessagesByMode((prev) => ({
          ...prev,
          [activeMode]: [
            ...prev[activeMode],
            { id: Date.now(), content: textResponse, isUser: false },
          ],
        }));
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const toggleCallMode = () => {
    setIsCallMode(!isCallMode);
  };

  return (
    <div
      className="flex-1 flex flex-col h-[calc(100vh-64px)]"
      style={{ backgroundColor: activeLighterColor }}
    >
      {isCallMode ? (
        <VoiceInterface onEndCall={toggleCallMode} />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messagesByMode[activeMode].map((message) => (
              <Message
                key={message.id}
                content={message.content}
                isUser={message.isUser}
                activeColor={activeColor}
                attachment={message.attachment}
              />
            ))}
            {isLoading && !isStreaming && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 bg-white border-2 border-black rounded-lg shadow-brutal">
                  <p className="text-base text-gray-500">
                    <span className="typing-dots"></span>
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <ChatInput
            onSend={handleSendMessage}
            onCallStart={toggleCallMode}
            isLoading={isLoading || isStreaming}
          />
        </>
      )}
    </div>
  );
}
