import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface MessageProps {
  content: string;
  isUser?: boolean;
  activeColor: string;
}

export function Message({
  content,
  isUser = false,
  activeColor,
}: MessageProps) {
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
          <p className="text-base">{content}</p>
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
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
