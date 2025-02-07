import { cn } from "@/lib/utils";

interface MessageProps {
  content: string;
  isUser?: boolean;
}

export function Message({ content, isUser = false }: MessageProps) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={cn(
          "max-w-[80%] p-3 border-2 border-black rounded-lg",
          isUser
            ? "bg-primary text-primary-foreground shadow-brutal"
            : "bg-white shadow-brutal"
        )}
      >
        <p className="text-base">{content}</p>
      </div>
    </div>
  );
}
