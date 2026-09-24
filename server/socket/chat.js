// Handles real-time collaborative-listening chat rooms.
// Each "room" represents a shared listening session; users in the
// same room see each other's chat messages and online status.

export const initChatSocket = (io) => {
  const roomUsers = new Map(); // roomId -> Map(socketId -> { userId, name })

  io.on("connection", (socket) => {
    socket.on("join_room", ({ roomId, userId, name }) => {
      socket.join(roomId);

      if (!roomUsers.has(roomId)) roomUsers.set(roomId, new Map());
      roomUsers.get(roomId).set(socket.id, { userId, name });

      io.to(roomId).emit("online_users", Array.from(roomUsers.get(roomId).values()));
      socket.to(roomId).emit("user_joined", { name });

      socket.data.roomId = roomId;
      socket.data.name = name;
    });

    socket.on("send_message", ({ roomId, message, senderName }) => {
      io.to(roomId).emit("receive_message", {
        message,
        senderName,
        timestamp: new Date().toISOString(),
      });
    });

    // Keep everyone in the room in sync on play/pause/seek of the shared track
    socket.on("playback_sync", ({ roomId, action, timestamp, songId }) => {
      socket.to(roomId).emit("playback_sync", { action, timestamp, songId });
    });

    socket.on("disconnect", () => {
      const { roomId, name } = socket.data;
      if (roomId && roomUsers.has(roomId)) {
        roomUsers.get(roomId).delete(socket.id);
        io.to(roomId).emit("online_users", Array.from(roomUsers.get(roomId).values()));
        socket.to(roomId).emit("user_left", { name });
      }
    });
  });
};
