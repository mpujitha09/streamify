import express from "express";
import User from "../models/User.js";
import { requireAuth, clerkClient } from "../middleware/auth.js";

const router = express.Router();

// Sync the logged-in Clerk user into our own DB (call this once after sign-in)
router.post("/sync", requireAuth, async (req, res) => {
  try {
    const { userId } = req.auth;
    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId);
      user = await User.create({
        clerkId: userId,
        fullName: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Streamify User",
        imageUrl: clerkUser.imageUrl,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get the current user's liked songs (populated)
router.get("/liked", requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId }).populate("likedSongs");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.likedSongs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like a song
router.post("/liked/:songId", requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.likedSongs.includes(req.params.songId)) {
      user.likedSongs.push(req.params.songId);
      await user.save();
    }

    const populated = await user.populate("likedSongs");
    res.json(populated.likedSongs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Unlike a song
router.delete("/liked/:songId", requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.likedSongs = user.likedSongs.filter((id) => id.toString() !== req.params.songId);
    await user.save();

    const populated = await user.populate("likedSongs");
    res.json(populated.likedSongs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
