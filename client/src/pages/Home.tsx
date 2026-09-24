import { useEffect, useMemo, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { api, type Song, type Playlist } from "@/lib/api";
import SongList from "@/components/SongList";
import Player from "@/components/Player";
import Playlists from "@/components/Playlists";
import ChatRoom from "@/components/ChatRoom";
import SearchBar from "@/components/SearchBar";

type View = { type: "all" } | { type: "liked" } | { type: "playlist"; playlist: Playlist };

export default function Home() {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [view, setView] = useState<View>({ type: "all" });
  const [search, setSearch] = useState("");

  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    (async () => {
      const fetchedSongs = await api.getSongs();
      setSongs(fetchedSongs);
      setQueue(fetchedSongs);

      const token = await getToken();
      if (token) {
        await api.syncUser(token);
        const [myPlaylists, liked] = await Promise.all([
          api.getMyPlaylists(token),
          api.getLikedSongs(token),
        ]);
        setPlaylists(myPlaylists);
        setLikedSongs(liked);
      }
    })();
  }, []);

  const likedSongIds = useMemo(() => new Set(likedSongs.map((s) => s._id)), [likedSongs]);

  const currentList: Song[] =
    view.type === "all" ? songs : view.type === "liked" ? likedSongs : view.playlist.songs;

  const visibleSongs = useMemo(() => {
    if (!search.trim()) return currentList;
    const q = search.toLowerCase();
    return currentList.filter(
      (s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
    );
  }, [currentList, search]);

  const playSong = (index: number) => {
    setQueue(visibleSongs);
    setCurrentIndex(index);
  };

  const createPlaylist = async (name: string) => {
    const token = await getToken();
    if (!token) return;
    const p = await api.createPlaylist(token, name);
    setPlaylists((prev) => [...prev, { ...p, songs: [] }]);
  };

  const addToPlaylist = async (songId: string, playlistId: string) => {
    const token = await getToken();
    if (!token) return;
    const updated = await api.addSongToPlaylist(token, playlistId, songId);
    setPlaylists((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    if (view.type === "playlist" && view.playlist._id === updated._id) {
      setView({ type: "playlist", playlist: updated });
    }
  };

  const toggleLike = async (songId: string) => {
    const token = await getToken();
    if (!token) return;
    if (likedSongIds.has(songId)) {
      const updated = await api.unlikeSong(token, songId);
      setLikedSongs(updated);
    } else {
      const updated = await api.likeSong(token, songId);
      setLikedSongs(updated);
    }
  };

  const title =
    view.type === "all" ? "All Songs" : view.type === "liked" ? "Liked Songs" : view.playlist.name;

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 gap-4 overflow-hidden p-4 pb-24">
        <aside className="w-56 shrink-0 overflow-y-auto">
          <div className="mb-4 flex flex-col gap-1">
            <button
              onClick={() => setView({ type: "all" })}
              className={`rounded-md px-2 py-1.5 text-left text-sm hover:bg-white/5 ${
                view.type === "all" ? "bg-white/10" : "text-muted"
              }`}
            >
              All Songs
            </button>
            <button
              onClick={() => setView({ type: "liked" })}
              className={`rounded-md px-2 py-1.5 text-left text-sm hover:bg-white/5 ${
                view.type === "liked" ? "bg-white/10" : "text-muted"
              }`}
            >
              ❤ Liked Songs ({likedSongs.length})
            </button>
          </div>

          <Playlists
            playlists={playlists}
            onCreate={createPlaylist}
            onSelect={(p) => setView({ type: "playlist", playlist: p })}
            selectedId={view.type === "playlist" ? view.playlist._id : undefined}
          />
        </aside>

        <main className="flex-1 overflow-y-auto">
          <h1 className="mb-2 text-xl font-semibold">{title}</h1>
          <SearchBar value={search} onChange={setSearch} />
          <SongList
            songs={visibleSongs}
            onPlay={playSong}
            playlists={playlists}
            onAddToPlaylist={addToPlaylist}
            likedSongIds={likedSongIds}
            onToggleLike={toggleLike}
          />
        </main>

        <aside className="w-80 shrink-0">
          <ChatRoom roomId="main-room" userName={user?.firstName || user?.username || "Guest"} />
        </aside>
      </div>

      <Player queue={queue} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} roomId="main-room" />
    </div>
  );
}
