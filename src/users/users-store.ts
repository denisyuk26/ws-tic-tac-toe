import { EntityStore } from "../domain/entity-store";
import { User } from "./user";

export class UserStore extends EntityStore<User> {
  constructor() {
    super();
  }

  public get userList() {
    return this.collection;
  }

  public getUser(id: string) {
    return this.collection.get(id);
  }

  public addUser(user: User) {
    if (this.collection.has(user.id)) {
      return;
    }

    this.collection.set(user.id, user);
  }

  public removeUser(id: string) {
    if (!this.collection.has(id)) {
      return;
    }

    this.collection.delete(id);
  }
}

const userStore = new UserStore();

export default userStore;
