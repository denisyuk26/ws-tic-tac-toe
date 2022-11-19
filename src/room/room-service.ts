import { Room, RoomPlayer, RoomStatus } from "./room";

export class RoomService {
  constructor() {}

  public addUser(room: Room, user: RoomPlayer): Room {
    const updatetRoom = room;
    updatetRoom.users.set(user.id, user);

    return updatetRoom;
  }

  public removeUser(room: Room, userId: string): void {
    if (!room.users.has(userId)) {
      return;
    }
    room.users.delete(userId);
  }

  public changeRoomStatus(room: Room): Room {
    const updatedRoom = room;
    if (room.users.size === 2) {
      updatedRoom.status = RoomStatus.Full;
      return updatedRoom;
    }

    updatedRoom.status = RoomStatus.Pending;
    return updatedRoom;
  }
}

const roomService = new RoomService();

export default roomService;
