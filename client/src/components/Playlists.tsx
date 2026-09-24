import { useState } from "react";
import type { Playlist } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PlaylistsProps {
  playlists: Playlist[];
  onCreate: (name: string) => void;
  onSelect: (playlist: Playlist) => void;
  selectedId?: string;
}

export default function Playlists({ playlists, onCreate, onSelect, selectedId }: PlaylistsProps) {
  const [name, setName] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Your Playlists</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          onCreate(name.trim());
          setName("");
        }}
        className="flex gap-2"
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New playlist"
        />
        <Button type="submit" size="sm">
          Add
        </Button>
      </form>

      <div className="flex flex-col gap-1">
        {playlists.map((p) => (
          <button
            key={p._id}
            onClick={() => onSelect(p)}
            className={`truncate rounded-md px-2 py-1.5 text-left text-sm hover:bg-white/5 ${
              selectedId === p._id ? "bg-white/10 text-white" : "text-muted"
            }`}
          >
            {p.name} <span className="text-xs text-muted">({p.songs.length})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
