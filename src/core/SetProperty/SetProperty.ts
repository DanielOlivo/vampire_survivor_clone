import { Signal } from "../signal";

export class SetProperty<T> implements Iterable<T> {
  added: Signal<T>;
  deleted: Signal<T>;
  set: Set<T>;

  constructor(iterable?: Iterable<T>) {
    this.set = new Set(iterable);
    this.added = new Signal<T>();
    this.deleted = new Signal<T>();
  }

  has(value: T): boolean {
    return this.set.has(value);
  }

  add(value: T): this {
    const has = this.set.has(value);
    if (!has) {
      this.set.add(value);
      this.added.emit(value);
    }
    return this;
  }

  delete(value: T): boolean {
    const result = this.set.delete(value);
    if (result) this.deleted.emit(value);
    return result;
  }

  clear(): void {
    const values = Array.from(this.set.values());
    this.set.clear();
    values.forEach((v) => this.deleted.emit(v));
  }

  values(): IterableIterator<T> {
    return this.set.values();
  }

  keys(): IterableIterator<T> {
    return this.set.keys();
  }

  entries(): IterableIterator<[T, T]> {
    return this.set.entries();
  }

  get size(): number {
    return this.set.size;
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.set[Symbol.iterator]();
  }
}
