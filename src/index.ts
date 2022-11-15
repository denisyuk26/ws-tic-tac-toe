import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
//@ts-ignore
import { getUser, addUser, removeUser } from "./domain/users/user.ts";

const app = express();
const port = process.env.PORT || 3535;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("");
});

io.on("connection", (socket: Socket) => {
  socket.on("join_room", (roomId: string) => {
    addUser(socket.id, { id: socket.id, room: roomId });
    const connected = io.sockets.adapter.rooms.get(roomId);
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );

    if (socketRooms.length > 0 || (connected && connected.size === 2)) {
      socket.emit("join_error", "room is full");
    } else {
      socket.join(roomId);

      if (io.sockets.adapter.rooms.get(roomId).size === 2) {
        socket.emit("room_joined", {
          id: roomId,
          status: "full",
          player: "o",
        });
        socket.broadcast.to(roomId).emit("room_joined", {
          id: roomId,
          status: "full",
          player: "x",
        });
        socket.emit("start_game", { status: "running", player: "o" });
        socket
          .to(roomId)
          .emit("start_game", { status: "running", player: "x" });
      } else {
        socket.emit("room_joined", {
          id: roomId,
          status: "pending",
          player: "x",
        });
      }
    }
  });

  socket.on("restart_game", () => {
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );
    const gameRoom = socketRooms && socketRooms[0];
    socket.emit("restarted_game", { status: "running", player: "o" });
    socket
      .to(gameRoom)
      .emit("restarted_game", { status: "running", player: "x" });
  });

  socket.on("make_move", (message) => {
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );
    const gameRoom = socketRooms && socketRooms[0];

    socket.to(gameRoom).emit("move_made", message);
  });

  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    if (user && user.room) {
      socket
        .to(user.room)
        .emit("room_left", { status: "pending", id: user.room });
      removeUser(socket.id);
    }
  });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
