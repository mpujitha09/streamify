const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface Song {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  audioUrl: string;
  duration: number;
}

export interface Playlist {
  _id: string;
  name: string;
  songs: Song[];
  isPublic: boolean;
}

async function request(path: string, token?: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error((await res.json()).message || "Request failed");
  return res.json();
}

export const api = {
  getSongs: (): Promise<Song[]> => request("/api/songs"),
  syncUser: (token: string) => request("/api/users/sync", token, { method: "POST" }),
  getMyPlaylists: (token: string): Promise<Playlist[]> => request("/api/playlists/mine", token),
  createPlaylist: (token: string, name: string) =>
    request("/api/playlists", token, { method: "POST", body: JSON.stringify({ name, isPublic: true }) }),
  addSongToPlaylist: (token: string, playlistId: string, songId: string) =>
    request(`/api/playlists/${playlistId}/songs/${songId}`, token, { method: "POST" }),
  getLikedSongs: (token: string): Promise<Song[]> => request("/api/users/liked", token),
  likeSong: (token: string, songId: string): Promise<Song[]> =>
    request(`/api/users/liked/${songId}`, token, { method: "POST" }),
  unlikeSong: (token: string, songId: string): Promise<Song[]> =>
    request(`/api/users/liked/${songId}`, token, { method: "DELETE" }),
};
