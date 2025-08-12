import { Signal } from "./signal";

type AreEqualFn<T> = (a: T, b: T) => boolean;

export class Property<T> {
  private _value: T;
  signal: Signal<T>;
  private areEqual: AreEqualFn<T> | undefined; // if defined, used on set to prevent unnecessary emits

  static from<K>(value: K) {
    return new Property<K>(value);
  }

  /**
   *
   * @param init - initial value of the property
   * @param areEqual - (optional) comparator: if true, emit call will be prevented
   */
  constructor(init: T, areEqual?: AreEqualFn<T>) {
    this._value = init;
    this.signal = new Signal();
    this.areEqual = areEqual;
  }

  set = (upd: T) => {
    const callEmit = !this.areEqual || !this.areEqual(upd, this._value);
    this._value = upd;
    if (callEmit) this.signal.emit(this._value);
  };

  get = () => this._value;

  emit = () => this.signal.emit(this._value);
}
