import { User } from "./user";

export class UsersManager {
  userList: Map<string, User>;

  constructor() {
    this.userList = new Map<string, User>();
  }

  public getUser(id: string) {
    return this.userList.get(id);
  }

  public addUser(user: User) {
    if (this.userList.has(user.id)) {
      return;
    }

    this.userList.set(user.id, user);
  }

  public removeUser(id: string) {
    if (!this.userList.has(id)) {
      return;
    }

    this.userList.delete(id);
  }

  public updateUserRoom(userId: string, roomId: string) {
    const user = this.userList.get(userId);
    user.room = roomId;
  }
}

const usersManager = new UsersManager();

export default usersManager;
