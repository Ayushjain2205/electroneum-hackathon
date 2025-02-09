import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { StreakCard } from "./templates/streak-card";
import { type StreakDisplay } from "@/lib/streak-templates";

interface MessageProps {
  content: string | StreakDisplay;
  isUser?: boolean;
  activeColor: string;
}

export function Message({
  content,
  isUser = false,
  activeColor,
}: MessageProps) {
  // Helper to check if content is a template
  const isTemplate = (content: any): content is StreakDisplay => {
    return typeof content === "object" && "type" in content;
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={cn(
          "max-w-[80%] p-3 border-2 border-black rounded-lg",
          isUser ? "text-black shadow-brutal" : "bg-white shadow-brutal"
        )}
        style={{ backgroundColor: isUser ? activeColor : undefined }}
      >
        {isUser ? (
          <p className="text-base">{content as string}</p>
        ) : isTemplate(content) ? (
          // Render appropriate template based on type
          content.type === "streak" ? (
            <StreakCard data={content.data} />
          ) : null
        ) : (
          <ReactMarkdown
            className="text-base prose prose-neutral max-w-none"
            components={{
              a: (props) => (
                <a
                  {...props}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
              code: ({ className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || "");
                const isInline = !match;
                return (
                  <code
                    {...props}
                    className={
                      isInline
                        ? "bg-gray-100 rounded px-1 py-0.5 text-sm"
                        : "block bg-gray-100 rounded p-2 text-sm overflow-x-auto"
                    }
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {content as string}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
