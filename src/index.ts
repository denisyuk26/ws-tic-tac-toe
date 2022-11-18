import express from "express";
import http from "http";

import { Server, Socket } from "socket.io";
import { User } from "./users/user";
import { GameStatus } from "./game/game-enums";
import usersManager from "./users/users-manager";
import roomStore from "./room/room-store";
import { RoomManager } from "./room/room-manager";

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
  usersManager.addUser(user);

  socket.on("join_room", (roomId: string) => {
    roomStore.createRoom(roomId);
    const room = roomStore.getRoom(roomId);
    const roomManager = new RoomManager(room);

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
      usersManager.updateUserRoom(user.id, roomId);
      roomManager.addSecondPlayerAndEmit(socket, user);
      roomManager.startGameAndEmit(socket);
    } else {
      usersManager.updateUserRoom(user.id, roomId);
      roomManager.addFirstPlayerAndEmit(socket, user);
    }
  });

  socket.on("restart_game", () => {
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );

    const gameRoom = socketRooms && socketRooms[0];
    const room = roomStore.getRoom(gameRoom);
    const roomManager = new RoomManager(room);
    roomManager.restartGameAndEmit(socket);
  });

  socket.on("make_move", (message: { coordinate: number }) => {
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );

    const gameRoom = socketRooms && socketRooms[0];
    const room = roomStore.getRoom(gameRoom);

    const roomManager = new RoomManager(room);
    roomManager.makeMoveAndEmit(socket, message.coordinate);

    if (room.game.gameStatus === GameStatus.Win) {
      roomManager.emitWinner(socket);
    }

    if (room.game.gameStatus === GameStatus.Draw) {
      roomManager.emitDraw(socket);
    }
  });

  socket.on("disconnect", () => {
    const user = usersManager.getUser(socket.id);
    if (user.room === "main") {
      return;
    }
    roomStore.removeRoomIfEmpty(user.room);
    const room = roomStore.getRoom(user.room);
    const roomManager = new RoomManager(room);

    if (user && user.room) {
      roomManager.removeUserFromRoomAndEmit(socket, user);
    }
    usersManager.removeUser(socket.id);
  });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
