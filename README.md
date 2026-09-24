# Streamify — Music Streaming Platform

Full-stack MERN music streaming platform with secure authentication (Clerk),
real-time collaborative listening chat (Socket.IO), and playlist management.

## Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS, ShadCN-style UI, Clerk
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), Socket.IO
- **Auth:** Clerk

## Features
- Secure sign-in via Clerk
- Browse and stream songs (demo tracks included)
- Create and manage playlists
- Real-time chat + synced playback in a shared "listening room"

## Project Structure
```
streamify/
  server/   # Express + MongoDB + Socket.IO API
  client/   # React + TypeScript + Tailwind frontend
```

## Local Setup

### 1. Backend
```bash
cd server
npm install
cp .env.example .env   # fill in MONGODB_URI and CLERK_SECRET_KEY
npm run dev
```

Seed demo songs:
```bash
node data/seed.js
```

### 2. Frontend
```bash
cd client
npm install
cp .env.example .env   # fill in VITE_CLERK_PUBLISHABLE_KEY
npm run dev
```

Visit `http://localhost:5173`.

## Deployment
- **Backend:** Render (Node web service)
- **Frontend:** Vercel

See `DEPLOY.md` for step-by-step instructions.
