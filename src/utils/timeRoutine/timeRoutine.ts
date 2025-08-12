import { Ticker } from "pixi.js";

export type TimeGetter = () => number;

type Routine = Generator<number, void, unknown>;

export function getRoutineManager() {
  type Item = {
    routine: Routine;
    nextCall: number;
    name: string;
  };

  let timer = 0;
  const timeGetter: TimeGetter = () => timer;
  let routines: Item[] = [];

  const toAdd: Item[] = [];
  const toRemove: Routine[] = [];

  let count = 0;
  /** should add name argument? */
  const connect = (
    routineGetter: (tg: TimeGetter) => Routine,
    name?: string,
  ) => {
    const startTime = timeGetter();
    const _timeGetter = () => timer - startTime;
    const item: Item = {
      routine: routineGetter(_timeGetter),
      nextCall: 0,
      name: name ?? `unnamed routine ${count}`,
    };
    toAdd.push(item);

    // console.log('routines.connect', toAdd.length)
    count += 1;
  };

  const disconnect = (routine: Routine) => {
    toRemove.push(routine);
  };

  const manage = () => {
    // let toSort = false
    if (toAdd.length > 0) {
      routines = routines.concat(toAdd);
      toAdd.splice(0, toAdd.length);
      // console.log('added: ', routines)
    }

    if (toRemove.length > 0) {
      routines = routines.filter((item) => !toRemove.includes(item.routine));
      toRemove.splice(0, toRemove.length);
      // console.log('removed:', routines)
    }

    routines.sort((a, b) => a.nextCall - b.nextCall); // ascending order
  };

  const fixedTimestamp = 1 / 60;
  const handleTimeUpdate = (time: Ticker) => {
    const delta = fixedTimestamp * time.deltaTime;
    timer += delta;
    // console.log(timer)

    manage();
    let onlyNow = true;
    for (const item of routines) {
      if (onlyNow) onlyNow = item.nextCall <= 0;
      if (onlyNow) {
        const { done, value } = item.routine.next();
        if (done === true) {
          // console.log('routine is done')
          toRemove.push(item.routine);
        } else {
          item.nextCall = value;
        }
      }
      item.nextCall -= delta;
    }

    manage();
  };

  const toConsole = () => {
    return routines.map((r) => ({ name: r.name, nextCall: r.nextCall }));
  };

  const clear = () => {
    routines.forEach((routine) => toRemove.push(routine.routine));
  };

  return {
    connect,
    disconnect,
    handleTimeUpdate,
    manage,
    toConsole,

    clear,
  };
}

export function* someRoutine(getTime: TimeGetter) {
  while (true)
    if (getTime() < 2)
      yield; // skip to the next frame
    else break;

  console.log("hello");

  yield 3; // yield for three seconds

  console.log("here we are");

  while (true) {
    if (getTime() < 0) return;
    yield;
    console.log("almost end");
  }
}
