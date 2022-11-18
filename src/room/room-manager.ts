import { Socket } from "socket.io";
import { User } from "../users/user";
import { PlayerSymbol, Room } from "./room";
import { RoomService } from "./room-service";

export class RoomManager {
  room: Room;
  roomService: RoomService;
  constructor(room: Room, roomService: RoomService = new RoomService()) {
    this.room = room;
    this.roomService = roomService;
  }

  private attachUserToRoom(user: User, symbol: PlayerSymbol) {
    const room = this.room;

    if (!room) {
      throw new Error("can not get room while attach user");
    }

    const roomPlayer = room.users.get(user.id);
    if (roomPlayer) {
      return;
    }

    const player = { ...user, room: this.room.id, symbol };

    this.roomService.addUser(room, player);
    this.roomService.changeRoomStatus(room);
  }

  public addFirstPlayerAndEmit(socket: Socket, user: User) {
    this.attachUserToRoom(user, PlayerSymbol.Cross);

    socket.emit("room_joined", {
      id: this.room.id,
      status: this.room.status,
      player: PlayerSymbol.Cross,
    });
  }

  public addSecondPlayerAndEmit(socket: Socket, user: User) {
    this.attachUserToRoom(user, PlayerSymbol.Circle);

    socket.emit("room_joined", {
      id: this.room.id,
      status: this.room.status,
      player: PlayerSymbol.Circle,
    });
    socket.broadcast.to(this.room.id).emit("room_joined", {
      id: this.room.id,
      status: this.room.status,
      player: PlayerSymbol.Cross,
    });
  }

  public startGameAndEmit(socket: Socket) {
    this.room.game.restartGame();
    const clearBoard = this.room.game.gameBoard;

    socket.emit("start_game", {
      status: this.room.game.gameStatus,
      player: PlayerSymbol.Circle,
      board: clearBoard,
    });
    socket.to(this.room.id).emit("start_game", {
      status: this.room.game.gameStatus,
      player: PlayerSymbol.Cross,
      board: clearBoard,
    });
  }

  public restartGameAndEmit(socket: Socket) {
    const clearBoard = this.room.game.restartGame();

    socket.emit("restarted_game", {
      status: this.room.game.gameStatus,
      player: PlayerSymbol.Circle,
      board: clearBoard,
    });
    socket.to(this.room.id).emit("restarted_game", {
      status: this.room.game.gameStatus,
      player: PlayerSymbol.Cross,
      board: clearBoard,
    });
  }

  public makeMoveAndEmit(socket: Socket, coordinate: number) {
    const roomCurrentPlayer = this.room.users.get(socket.id);
    this.room.game.makeMove(coordinate, roomCurrentPlayer.symbol);

    const data = this.room.game.gameBoard;

    socket.emit("move_made", {
      board: data,
      move: [coordinate, roomCurrentPlayer.symbol],
    });
    socket.to(this.room.id).emit("move_made", {
      board: data,
      move: [coordinate, roomCurrentPlayer.symbol],
    });
  }

  public emitWinner(socket: Socket) {
    const combination = this.room.game.gameWinCombination;
    const roomCurrentPlayer = this.room.users.get(socket.id);
    socket.emit("winner", { user: roomCurrentPlayer.symbol, combination });
    socket
      .to(this.room.id)
      .emit("winner", { user: roomCurrentPlayer.symbol, combination });
  }

  public emitDraw(socket: Socket) {
    socket.emit("draw");
    socket.to(this.room.id).emit("draw");
  }

  public unatachUserFromRoom(userId: string) {
    const userForRemove = this.room.users.get(userId);
    if (!userForRemove) {
      return;
    }

    this.roomService.removeUser(this.room, userForRemove.id);
    this.roomService.changeRoomStatus(this.room);
  }

  public removeUserFromRoomAndEmit(socket: Socket, user: User) {
    this.unatachUserFromRoom(user.id);

    socket.to(user.room).emit("room_left", {
      status: "pending",
      id: user.room,
    });
  }
}
