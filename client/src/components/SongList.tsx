import { useState } from "react";
import type { Song, Playlist } from "@/lib/api";
import { Play, Heart, Plus } from "lucide-react";

interface SongListProps {
  songs: Song[];
  onPlay: (index: number) => void;
  playlists: Playlist[];
  onAddToPlaylist: (songId: string, playlistId: string) => void;
  likedSongIds: Set<string>;
  onToggleLike: (songId: string) => void;
}

export default function SongList({
  songs,
  onPlay,
  playlists,
  onAddToPlaylist,
  likedSongIds,
  onToggleLike,
}: SongListProps) {
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-1">
      {songs.map((song, i) => (
        <div
          key={song._id}
          className="group relative flex items-center gap-3 rounded-md p-2 hover:bg-white/5"
        >
          <div className="relative h-10 w-10 shrink-0">
            <img src={song.imageUrl} alt={song.title} className="h-10 w-10 rounded object-cover" />
            <button
              onClick={() => onPlay(i)}
              className="absolute inset-0 flex items-center justify-center rounded bg-black/50 opacity-0 group-hover:opacity-100"
            >
              <Play size={16} />
            </button>
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">{song.title}</p>
            <p className="truncate text-xs text-muted">{song.artist}</p>
          </div>

          <button
            onClick={() => onToggleLike(song._id)}
            className={`opacity-0 group-hover:opacity-100 ${
              likedSongIds.has(song._id) ? "!opacity-100 text-primary" : "text-muted hover:text-white"
            }`}
            title="Like"
          >
            <Heart size={16} fill={likedSongIds.has(song._id) ? "currentColor" : "none"} />
          </button>

          <div className="relative">
            <button
              onClick={() => setOpenMenuFor(openMenuFor === song._id ? null : song._id)}
              className="text-muted opacity-0 group-hover:opacity-100 hover:text-white"
              title="Add to playlist"
            >
              <Plus size={16} />
            </button>

            {openMenuFor === song._id && (
              <div className="absolute right-0 top-6 z-10 w-44 rounded-md bg-surface p-1 shadow-lg ring-1 ring-white/10">
                {playlists.length === 0 ? (
                  <p className="px-2 py-1.5 text-xs text-muted">No playlists yet</p>
                ) : (
                  playlists.map((p) => (
                    <button
                      key={p._id}
                      onClick={() => {
                        onAddToPlaylist(song._id, p._id);
                        setOpenMenuFor(null);
                      }}
                      className="block w-full truncate rounded px-2 py-1.5 text-left text-sm hover:bg-white/10"
                    >
                      {p.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {songs.length === 0 && (
        <p className="px-2 py-6 text-center text-sm text-muted">No songs found.</p>
      )}
    </div>
  );
}
