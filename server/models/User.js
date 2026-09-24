import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    imageUrl: { type: String },
    email: { type: String, required: true, unique: true },
    likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
