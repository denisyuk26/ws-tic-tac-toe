import { BaseEntity } from "./base-entity";

export class EntityStore<T extends BaseEntity> {
  collection: Map<string, T>;
  constructor() {
    this.collection = new Map<string, T>();
  }

  public getAll() {
    return this.collection;
  }

  public getOne(id: string) {
    return this.collection.get(id);
  }

  public add(entity: T) {
    if (this.collection.has(entity.id)) {
      return;
    }

    this.collection.set(entity.id, entity);
  }

  public update(entity: T) {
    if (!this.collection.has(entity.id)) {
      return;
    }

    this.collection.set(entity.id, entity);
  }

  public delete(id: string) {
    if (!this.collection.has(id)) {
      return;
    }

    this.collection.delete(id);
  }
}
