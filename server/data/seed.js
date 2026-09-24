// Seeds the DB with free, freely-streamable demo tracks (SoundHelix sample MP3s)
// so the app has real playable audio out of the box.
// Run with: node data/seed.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import Song from "../models/Song.js";

dotenv.config();

const sampleSongs = [
  {
    title: "Sunset Drive",
    artist: "SoundHelix",
    imageUrl: "https://picsum.photos/seed/streamify1/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 300,
  },
  {
    title: "City Lights",
    artist: "SoundHelix",
    imageUrl: "https://picsum.photos/seed/streamify2/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 320,
  },
  {
    title: "Morning Coffee",
    artist: "SoundHelix",
    imageUrl: "https://picsum.photos/seed/streamify3/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: 280,
  },
  {
    title: "Late Night Drive",
    artist: "SoundHelix",
    imageUrl: "https://picsum.photos/seed/streamify4/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: 340,
  },
  {
    title: "Ocean Breeze",
    artist: "SoundHelix",
    imageUrl: "https://picsum.photos/seed/streamify5/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    duration: 310,
  },
  {
    title: "Neon Nights",
    artist: "SoundHelix",
    imageUrl: "https://picsum.photos/seed/streamify6/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    duration: 295,
  },
  {
    title: "Golden Hour",
    artist: "SoundHelix",
    imageUrl: "https://picsum.photos/seed/streamify7/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    duration: 330,
  },
  {
    title: "Rainy Window",
    artist: "SoundHelix",
    imageUrl: "https://picsum.photos/seed/streamify8/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    duration: 305,
  },
  {
    title: "Midnight Run",
    artist: "SoundHelix",
    imageUrl: "https://picsum.photos/seed/streamify9/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    duration: 315,
  },
  {
    title: "Open Road",
    artist: "SoundHelix",
    imageUrl: "https://picsum.photos/seed/streamify10/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    duration: 300,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Song.deleteMany({});
    await Song.insertMany(sampleSongs);
    console.log("Seeded", sampleSongs.length, "songs");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
