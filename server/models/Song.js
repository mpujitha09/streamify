import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    imageUrl: { type: String, required: true },
    audioUrl: { type: String, required: true },
    duration: { type: Number, required: true }, // seconds
  },
  { timestamps: true }
);

export default mongoose.model("Song", songSchema);
