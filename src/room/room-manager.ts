import { Socket } from "socket.io";
import { User } from "../users/user";
import { PlayerSymbol } from "./room";
import roomService, { RoomService } from "./room-service";
import roomStore, { RoomStore } from "./room-store";

export class RoomManager {
  private roomService: RoomService;
  private roomStore: RoomStore;
  constructor(
    roomService: RoomService = new RoomService(),
    roomStore: RoomStore
  ) {
    this.roomService = roomService;
    this.roomStore = roomStore;
  }

  public get rooms() {
    return this.roomStore.rooms;
  }

  public getGameStatus(roomId: string) {
    const room = this.roomStore.getRoom(roomId);
    if (!room) {
      return;
    }

    return room.game.gameStatus;
  }

  public createRoom(roomId: string) {
    return this.roomStore.createRoom(roomId);
  }

  private attachUserToRoom(roomId: string, user: User, symbol: PlayerSymbol) {
    const room = this.roomStore.getOne(roomId);

    if (!room) {
      throw new Error("can not get room while attach user");
    }

    const roomPlayer = room.users.get(user.id);
    if (roomPlayer) {
      return;
    }

    const player = { ...user, room: roomId, symbol };

    this.roomService.addUser(room, player);
    return this.roomService.changeRoomStatus(room);
  }

  public addFirstPlayerAndEmit(socket: Socket, roomId: string, user: User) {
    const room = this.attachUserToRoom(roomId, user, PlayerSymbol.Cross);
    this.roomStore.update(room);

    socket.emit("room_joined", {
      id: room.id,
      status: room.status,
      player: PlayerSymbol.Cross,
    });
  }

  public addSecondPlayerAndEmit(socket: Socket, roomId: string, user: User) {
    const room = this.attachUserToRoom(roomId, user, PlayerSymbol.Circle);
    this.roomStore.update(room);

    socket.emit("room_joined", {
      id: room.id,
      status: room.status,
      player: PlayerSymbol.Circle,
    });
    socket.broadcast.to(roomId).emit("room_joined", {
      id: room.id,
      status: room.status,
      player: PlayerSymbol.Cross,
    });
  }

  public startGameAndEmit(socket: Socket, roomId: string) {
    const room = this.roomStore.getOne(roomId);

    room.game.restartGame();
    const clearBoard = room.game.gameBoard;

    roomStore.update(room);

    socket.emit("start_game", {
      status: room.game.gameStatus,
      player: PlayerSymbol.Circle,
      board: clearBoard,
    });
    socket.to(room.id).emit("start_game", {
      status: room.game.gameStatus,
      player: PlayerSymbol.Cross,
      board: clearBoard,
    });
  }

  public restartGameAndEmit(socket: Socket, roomId: string) {
    const room = this.roomStore.getOne(roomId);

    const clearBoard = room.game.restartGame();

    socket.emit("restarted_game", {
      status: room.game.gameStatus,
      player: PlayerSymbol.Circle,
      board: clearBoard,
    });
    socket.to(room.id).emit("restarted_game", {
      status: room.game.gameStatus,
      player: PlayerSymbol.Cross,
      board: clearBoard,
    });
  }

  public makeMoveAndEmit(socket: Socket, roomId: string, coordinate: number) {
    const room = this.roomStore.getOne(roomId);

    const roomCurrentPlayer = room.users.get(socket.id);
    room.game.makeMove(coordinate, roomCurrentPlayer.symbol);

    const data = room.game.gameBoard;

    roomStore.update(room);

    socket.emit("move_made", {
      board: data,
      move: [coordinate, roomCurrentPlayer.symbol],
    });
    socket.to(room.id).emit("move_made", {
      board: data,
      move: [coordinate, roomCurrentPlayer.symbol],
    });
  }

  public emitWinner(socket: Socket, roomId: string) {
    const room = this.roomStore.getOne(roomId);

    const combination = room.game.gameWinCombination;
    const roomCurrentPlayer = room.users.get(socket.id);
    socket.emit("winner", { user: roomCurrentPlayer.symbol, combination });
    socket
      .to(room.id)
      .emit("winner", { user: roomCurrentPlayer.symbol, combination });
  }

  public emitDraw(socket: Socket, roomId: string) {
    socket.emit("draw");
    socket.to(roomId).emit("draw");
  }

  public unatachUserFromRoom(userId: string, roomId: string) {
    const room = this.roomStore.getOne(roomId);

    const userForRemove = room.users.get(userId);
    if (!userForRemove) {
      return;
    }

    this.roomService.removeUser(room, userForRemove.id);
    return this.roomService.changeRoomStatus(room);
  }

  public removeUserFromRoomAndEmit(socket: Socket, user: User, roomId: string) {
    const room = this.unatachUserFromRoom(user.id, roomId);
    this.roomStore.update(room);

    socket.to(room.id).emit("room_left", {
      status: "pending",
      id: room.id,
    });
  }

  public removeRoomIfEmpty(roomId: string) {
    const room = this.roomStore.getOne(roomId);

    if (room.users.size === 0) {
      this.roomStore.delete(roomId);
    }
  }
}

const roomManager = new RoomManager(roomService, roomStore);

export default roomManager;
