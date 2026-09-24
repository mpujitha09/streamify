import express from "express";
import Playlist from "../models/Playlist.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Get current user's playlists
router.get("/mine", requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const playlists = await Playlist.find({ owner: user._id }).populate("songs");
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a playlist
router.post("/", requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, isPublic } = req.body;
    const playlist = await Playlist.create({ name, owner: user._id, isPublic });
    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a song to a playlist
router.post("/:id/songs/:songId", requireAuth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    if (!playlist.songs.includes(req.params.songId)) {
      playlist.songs.push(req.params.songId);
      await playlist.save();
    }

    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
