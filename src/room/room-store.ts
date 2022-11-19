import { EntityStore } from "../domain/entity-store";
import { PlayerSymbol, Room, RoomPlayer, RoomStatus } from "./room";

export class RoomStore extends EntityStore<Room> {
  constructor() {
    super();
  }

  public get rooms() {
    return this.collection;
  }

  public getRoom(roomId: string) {
    return this.collection.get(roomId);
  }

  public createRoom(id: string): void {
    if (this.collection.has(id)) {
      return;
    }

    const usersMap = new Map<PlayerSymbol, RoomPlayer>();
    const room = new Room(id, RoomStatus.Pending, usersMap);

    super.add(room);
  }

  public removeRoomIfEmpty(id: string): void {
    const room = this.collection.get(id);
    if (!room) {
      return;
    }

    if (room.users.size > 0) {
      return;
    }

    super.delete(id);
  }
}

const roomStore = new RoomStore();

export default roomStore;
