import { cn } from "@/lib/utils";

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
        <p className="text-base">{content}</p>
      </div>
    </div>
  );
}
