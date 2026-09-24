import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import type { Song } from "@/lib/api";
import { getSocket } from "@/lib/socket";

interface PlayerProps {
  queue: Song[];
  currentIndex: number;
  setCurrentIndex: (i: number) => void;
  roomId: string;
}

export default function Player({ queue, currentIndex, setCurrentIndex, roomId }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentSong = queue[currentIndex];
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.load();
    setProgress(0);

    if (isFirstRender.current) {
      // Don't auto-play on initial page load, only on song changes after that
      isFirstRender.current = false;
      return;
    }

    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [currentIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
    getSocket().emit("playback_sync", {
      roomId,
      action: isPlaying ? "pause" : "play",
      timestamp: audioRef.current.currentTime,
      songId: currentSong?._id,
    });
  };

  const next = () => setCurrentIndex((currentIndex + 1) % queue.length);
  const prev = () => setCurrentIndex((currentIndex - 1 + queue.length) % queue.length);

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center gap-4 border-t border-white/10 bg-surface px-6 py-3">
      <img src={currentSong.imageUrl} alt={currentSong.title} className="h-12 w-12 rounded object-cover" />
      <div className="w-40 shrink-0">
        <p className="truncate text-sm font-medium">{currentSong.title}</p>
        <p className="truncate text-xs text-muted">{currentSong.artist}</p>
      </div>

      <div className="flex flex-1 flex-col items-center gap-1">
        <div className="flex items-center gap-4">
          <button onClick={prev} className="text-muted hover:text-white">
            <SkipBack size={18} />
          </button>
          <button
            onClick={togglePlay}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-black"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button onClick={next} className="text-muted hover:text-white">
            <SkipForward size={18} />
          </button>
        </div>
        <input
          type="range"
          min={0}
          max={currentSong.duration}
          value={progress}
          onChange={(e) => {
            const t = Number(e.target.value);
            if (audioRef.current) audioRef.current.currentTime = t;
            setProgress(t);
          }}
          className="w-full max-w-md accent-primary"
        />
      </div>

      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onEnded={next}
      />
    </div>
  );
}
