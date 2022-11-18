export class User {
  id: string;
  room: any;

  constructor(id: string, room: string) {
    this.id = id;
    this.room = room;
  }
}
