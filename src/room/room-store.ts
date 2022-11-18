import { PlayerSymbol, Room, RoomPlayer, RoomStatus } from "./room";

export class RoomStore {
  rooms: Map<string, Room>;
  constructor() {
    this.rooms = new Map();
  }

  public getRoom(roomId: string) {
    return this.rooms.get(roomId);
  }

  public updateRooms(rooms: Map<string, Room>) {
    this.rooms = rooms;
  }

  public createRoom(id: string): void {
    if (this.rooms.has(id)) {
      return;
    }

    const usersMap = new Map<PlayerSymbol, RoomPlayer>();
    const room = new Room(id, RoomStatus.Pending, usersMap);

    this.rooms.set(room.id, room);
  }

  public removeRoomIfEmpty(id: string): void {
    const room = this.rooms.get(id);
    if (!room) {
      return;
    }

    if (room.users.size > 0) {
      return;
    }

    this.rooms.delete(id);
  }
}

const roomStore = new RoomStore();

export default roomStore;
