import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { StreakCard } from "./templates/streak-card";
import { ManagerCard } from "./templates/manager-card";
import { type StreakDisplay } from "@/lib/streak-templates";
import { type ManagerDisplay } from "@/lib/manager-templates";
import { useState } from "react";
import { X } from "lucide-react";

interface MessageProps {
  content: string | StreakDisplay | ManagerDisplay;
  isUser?: boolean;
  activeColor: string;
  attachment?: {
    type: "image";
    url: string;
  };
}

export function Message({
  content,
  isUser = false,
  activeColor,
  attachment,
}: MessageProps) {
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  // Helper to check if content is a template
  const isTemplate = (
    content: any
  ): content is StreakDisplay | ManagerDisplay => {
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
        {attachment && (
          <div className="mb-3">
            <div className="relative group">
              <img
                src={attachment.url}
                alt="Attached image"
                className={cn(
                  "rounded-lg border border-black cursor-pointer transition-transform",
                  isImageExpanded ? "max-w-full" : "max-h-[300px] w-auto"
                )}
                style={{ objectFit: "contain" }}
                onClick={() => setIsImageExpanded(!isImageExpanded)}
              />
              {isImageExpanded && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsImageExpanded(false);
                  }}
                  className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {isImageExpanded ? "Click to shrink" : "Click to expand"}
                </div>
              </div>
            </div>
          </div>
        )}
        {content && (
          <div className={attachment ? "mt-2" : ""}>
            {isUser ? (
              <p className="text-base">{content as string}</p>
            ) : isTemplate(content) ? (
              content.type === "streak" ? (
                <StreakCard data={content.data} />
              ) : content.type === "schedule" || content.type === "tasks" ? (
                <ManagerCard type={content.type} data={content.data} />
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
        )}
      </div>
    </div>
  );
}
