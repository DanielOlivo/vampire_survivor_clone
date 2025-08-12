export interface ISignal<T> {
  emit: (arg: T) => void;
}

export type Listener<T> = (arg: T) => void;

export class Signal<T> {
  private _listeners = new Set<Listener<T>>();
  // private toAdd = new Set<Listener<T>>()
  // private toRemove = new Set<Listener<T>>()
  private toAddOrRemove = new Map<Listener<T>, boolean>(); // true - add, false - remove
  private insideEmit = false;
  public name = "";

  private latestValue: T | undefined;

  get listeners() {
    return this._listeners;
  }

  /** do not use anonymous functions */
  connect = (...ls: Listener<T>[]) => {
    ls.forEach((l) => this.toAddOrRemove.set(l, true));
    // ls.forEach(l => {
    //     this.toAdd.add(l)
    // })
  };

  disconnect = (...ls: Listener<T>[]) => {
    // ls.forEach(l => this.toRemove.add(l))
    ls.forEach((l) => this.toAddOrRemove.set(l, false));
  };

  setConnection = (en: boolean, ...ls: Listener<T>[]) => {
    if (en) {
      this.connect(...ls);
    } else {
      this.disconnect(...ls);
    }
  };

  manage = () => {
    if (this.toAddOrRemove.size > 0) {
      for (const [l, status] of this.toAddOrRemove.entries()) {
        if (status) this._listeners.add(l);
        else this._listeners.delete(l);
      }
      this.toAddOrRemove.clear();
    }
    // if((this.toAdd.size > 0 || this.toRemove.size > 0) && this.name === 'position'){
    //     console.log('toAdd', Array.from(this.toAdd))
    //     console.log('toRemove', Array.from(this.toRemove))
    // }

    // if(this.toAdd.size > 0){
    //     this.toAdd.forEach(l => this._listeners.add(l))
    //     this.toAdd.clear()
    // }
    // if(this.toRemove.size > 0){
    //     this.toRemove.forEach(l => this._listeners.delete(l))
    //     this.toRemove.clear()
    // }
  };

  emit = (arg: T) => {
    if (this.insideEmit) throw new Error("emit inside emit");

    this.insideEmit = true;
    this.manage();
    this._listeners.forEach((l) => {
      // if(this.name === 'position')
      //     console.log(l)
      l(arg);
    });
    this.manage();
    this.insideEmit = false;

    this.latestValue = arg;
  };

  emitLatest = () => {
    if (this.latestValue) this.emit(this.latestValue);
  };

  clear = () => {
    // this.toAdd.clear()
    // this.toRemove.clear()
    this.toAddOrRemove.clear();
    this._listeners.forEach((l) => this.toAddOrRemove.set(l, false));
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isSignal<T>(obj: any): obj is Signal<T> {
  return ["connect", "disconnect", "emit"].every((prop) => prop in obj);
}

export function getSignal<T>() {
  type Listener = (arg: T) => void;
  const listeners = new Set<Listener>();
  const toAdd = new Set<Listener>();
  const toRemove = new Set<Listener>();

  const connect = (...ls: Listener[]) => ls.forEach((l) => toAdd.add(l));
  const disconnect = (...ls: Listener[]) => ls.forEach((l) => toRemove.add(l));

  const emit = (arg: T) => {
    if (toAdd.size > 0) {
      toAdd.forEach((l) => listeners.add(l));
      toAdd.clear();
    }
    if (toRemove.size > 0) {
      toRemove.forEach((l) => listeners.delete(l));
      toRemove.clear();
    }
    listeners.forEach((l) => l(arg));
  };

  const clear = () => {
    toAdd.clear();
    toRemove.clear();
    listeners.forEach((l) => toRemove.add(l));
  };

  return {
    connect,
    disconnect,
    emit,
    clear,
  };
}
