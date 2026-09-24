import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  message: string;
  senderName: string;
  timestamp: string;
}

interface ChatRoomProps {
  roomId: string;
  userName: string;
}

export default function ChatRoom({ roomId, userName }: ChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<{ name: string }[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("join_room", { roomId, userId: userName, name: userName });

    socket.on("receive_message", (msg: ChatMessage) => setMessages((m) => [...m, msg]));
    socket.on("online_users", (users: { name: string }[]) => setOnlineUsers(users));

    return () => {
      socket.off("receive_message");
      socket.off("online_users");
    };
  }, [roomId, userName]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    getSocket().emit("send_message", { roomId, message: input.trim(), senderName: userName });
    setInput("");
  };

  return (
    <div className="flex h-full flex-col rounded-xl bg-surface p-3">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        Listening Room · {onlineUsers.length} online
      </h2>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {messages.map((m, i) => (
          <div key={i} className="text-sm">
            <span className="font-medium text-primary">{m.senderName}: </span>
            <span className="text-white/90">{m.message}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="mt-2 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Say something..."
        />
        <Button onClick={send} size="sm">
          Send
        </Button>
      </div>
    </div>
  );
}
