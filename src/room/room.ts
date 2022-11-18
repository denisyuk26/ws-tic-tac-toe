import { User } from "../users/user";
import { GameManager } from "../game/game-manager";
import { UsersManager } from "../users/users-manager";

export enum RoomStatus {
  Pending = "pending",
  Full = "full",
}

export enum PlayerSymbol {
  Circle = "o",
  Cross = "x",
}

export type RoomPlayer = User & { symbol: PlayerSymbol };

export class Room {
  id: string;
  users: Map<string, RoomPlayer>;
  status: RoomStatus;
  game: GameManager;
  constructor(
    id: string,
    status: RoomStatus,
    users: Map<string, RoomPlayer>,
    game: GameManager = new GameManager()
  ) {
    this.id = id;
    this.users = users;
    this.status = status;
    this.game = game;
  }
}
