import { Signal } from "../signal";

export class Map2Property<T, K, U> {
  map: Map<T, Map<K, U>>;
  added: Signal<[T, K, U]>;
  updated: Signal<[T, K, U]>;
  deleted: Signal<[T, K, U]>;

  constructor() {
    this.map = new Map();
    this.added = new Signal();
    this.updated = new Signal();
    this.deleted = new Signal();
  }

  has(key1: T, key2: K): boolean {
    if (this.map.has(key1)) {
      const submap = this.map.get(key1)!;
      return submap.has(key2);
    }
    return false;
  }

  set(key1: T, key2: K, value: U) {
    let exists = true;

    const subMap = (() => {
      if (this.map.has(key1)) {
        return this.map.get(key1)!;
      }
      exists = false;
      const newSubMap = new Map<K, U>();
      this.map.set(key1, newSubMap);
      return newSubMap;
    })();

    if (exists && !subMap.has(key2)) exists = false;

    subMap.set(key2, value);

    const args: [T, K, U] = [key1, key2, value];
    if (exists) this.updated.emit(args);
    else this.added.emit(args);
  }

  get(key1: T, key2: K): U | undefined {
    if (!this.map.has(key1)) return undefined;
    return this.map.get(key1)!.get(key2);
  }

  delete(key1: T, key2: K): boolean {
    if (!this.map.has(key1)) return false;

    const subMap = this.map.get(key1)!;
    if (!subMap.has(key2)) return false;

    const value = subMap.get(key2)!;
    subMap.delete(key2);

    this.deleted.emit([key1, key2, value]);
    return true;
  }

  getBySecondKey(key2: K): U | undefined {
    for (const subMap of this.map.values()) {
      if (subMap.has(key2)) return subMap.get(key2)!;
    }
    return undefined;
  }

  clear() {
    const items: [T, K, U][] = [];
    for (const [key1, subMap] of this.map.entries()) {
      for (const [key2, value] of subMap.entries()) {
        items.push([key1, key2, value]);
      }
    }
    this.map.clear();
    for (const arg of items) this.deleted.emit(arg);
  }

  *values(): IterableIterator<U> {
    for (const subMap of this.map.values()) {
      for (const value of subMap.values()) {
        yield value;
      }
    }
  }

  *keys(): IterableIterator<[T, K]> {
    for (const [key1, submap] of this.map.entries()) {
      for (const key2 of submap.keys()) {
        yield [key1, key2];
      }
    }
  }

  *entries(): IterableIterator<[T, K, U]> {
    for (const [key1, submap] of this.map.entries()) {
      for (const [key2, value] of submap.entries()) {
        yield [key1, key2, value];
      }
    }
  }
}
