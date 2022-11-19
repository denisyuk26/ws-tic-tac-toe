import { User } from "../users/user";
import { GameManager } from "../game/game-manager";
import { BaseEntity } from "../domain/base-entity";

export enum RoomStatus {
  Pending = "pending",
  Full = "full",
}

export enum PlayerSymbol {
  Circle = "o",
  Cross = "x",
}

export type RoomPlayer = User & { symbol: PlayerSymbol };

export class Room extends BaseEntity {
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
    super(id);
    this.id = id;
    this.users = users;
    this.status = status;
    this.game = game;
  }
}
