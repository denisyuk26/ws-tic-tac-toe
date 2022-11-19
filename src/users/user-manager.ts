import { User } from "./user";
import userStore, { UserStore } from "./users-store";

export class UserManager {
  private userStore: UserStore;
  constructor(userStore: UserStore) {
    this.userStore = userStore;
  }

  public connectUser(user: User) {
    this.userStore.addUser(user);
  }

  public updateUserRoom(userId: string, roomId: string) {
    const user = this.userStore.collection.get(userId);
    user.room = roomId;
    this.userStore.update(user);
  }

  public getUser(id: string) {
    return this.userStore.getUser(id);
  }

  public removeUser(id: string) {
    this.userStore.removeUser(id);
  }
}

const userManager = new UserManager(userStore);

export default userManager;
