import { BaseEntity } from "../domain/base-entity";

export class User extends BaseEntity {
  id: string;
  room: any;

  constructor(id: string, room: string) {
    super(id);
    this.id = id;
    this.room = room;
  }
}
