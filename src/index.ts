import express from "express";
import http from "http";

import { Server, Socket } from "socket.io";
import { User } from "./users/user";
import { GameStatus } from "./game/game-enums";
import roomManager from "./room/room-manager";
import userManager from "./users/user-manager";

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
  res.send("hello world");
});

io.on("connection", (socket: Socket) => {
  const user = new User(socket.id, "main");
  userManager.connectUser(user);

  socket.on("join_room", (roomId: string) => {
    roomManager.createRoom(roomId);

    const connected = io.sockets.adapter.rooms.get(roomId);
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );
    if (socketRooms.length > 0 || (connected && connected.size === 2)) {
      socket.emit("join_error", "room is full");
      return;
    }

    socket.join(roomId);

    if (io.sockets.adapter.rooms.get(roomId)?.size === 2) {
      userManager.updateUserRoom(user.id, roomId);
      roomManager.addSecondPlayerAndEmit(socket, roomId, user);
      roomManager.startGameAndEmit(socket, roomId);
    } else {
      userManager.updateUserRoom(user.id, roomId);
      roomManager.addFirstPlayerAndEmit(socket, roomId, user);
    }
  });

  socket.on("restart_game", () => {
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );

    const gameRoom = socketRooms && socketRooms[0];

    roomManager.restartGameAndEmit(socket, gameRoom);
  });

  socket.on("make_move", (message: { coordinate: number }) => {
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );

    const gameRoom = socketRooms && socketRooms[0];

    roomManager.makeMoveAndEmit(socket, gameRoom, message.coordinate);

    const gameStatus = roomManager.getGameStatus(gameRoom);

    if (gameStatus === GameStatus.Win) {
      roomManager.emitWinner(socket, gameRoom);
    }

    if (gameStatus === GameStatus.Draw) {
      roomManager.emitDraw(socket, gameRoom);
    }
  });

  socket.on("disconnect", () => {
    const user = userManager.getUser(socket.id);
    if (user.room === "main") {
      return;
    }
    roomManager.removeRoomIfEmpty(user.room);

    if (user && user.room) {
      roomManager.removeUserFromRoomAndEmit(socket, user, user.room);
    }
    userManager.removeUser(socket.id);
  });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
