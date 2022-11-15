type User = {
  id: string;
  room: string;
};

export const userList = new Map<string, User>();

export function getUser(id: string) {
  return userList.get(id);
}

export function addUser(id: string, user: User) {
  userList.set(id, user);
}

export function removeUser(id: string) {
  userList.delete(id);
}
