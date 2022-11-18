import { Room, RoomPlayer, RoomStatus } from "./room";

export class RoomService {
  constructor() {}

  public addUser(room: Room, user: RoomPlayer): void {
    room.users.set(user.id, user);
  }

  public removeUser(room: Room, userId: string): void {
    if (!room.users.has(userId)) {
      return;
    }
    room.users.delete(userId);
  }

  public changeRoomStatus(room: Room): void {
    if (room.users.size === 2) {
      room.status = RoomStatus.Full;
    }

    room.status = RoomStatus.Pending;
  }
}

const roomService = new RoomService();

export default roomService;
