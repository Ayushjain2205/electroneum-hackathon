import { ModeSelector } from "@/components/mode-selector";
import { ChatInterface } from "@/components/chat-interface";
import { Nav } from "@/components/navbar";

export default function TalkPage() {
  return (
    <div className="flex flex-col h-screen">
      <Nav />
      <main className="flex-1 flex overflow-hidden">
        <ModeSelector />
        <ChatInterface />
      </main>
    </div>
  );
}
