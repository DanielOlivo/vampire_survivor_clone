import { Ticker } from "pixi.js";
import { Signal } from "../../core/signal";

const fixedTimestamp = 1 / 60;

export interface PeriodicTimer {
  start: () => void;
  reset: () => void;
}

export type PeriodicTimerMaker = ReturnType<typeof getPeriodicTimer>;

/**
 *
 * @param timeUpdate - time update signal
 * @param fn - callback to be called at the end of each period
 * @param periods - if number, then a single period (in seconds); if array of numbers - periods (in seconds)
 * @param repeats - amount of repeats; if undefined - infinite (default)
 * @returns PeriodicTimer
 */
export function getPeriodicTimer(
  timeUpdate: Signal<Ticker>,
  fn: (i: number) => void,
  periods: number | number[],
  repeats?: number,
): PeriodicTimer {
  const _periods: number[] = (() => {
    if (typeof periods === "number") return [periods];
    else {
      if (periods.length < 1)
        throw new Error(
          "runWithPeriodicTimer: periods array must have a length at least one",
        );
      return periods;
    }
  })();

  let reps = repeats;
  let onRun = false;
  let timer = 0;
  let idx = 0;

  // const defaultReset = (): void => { throw new Error('TimerWithPeriods: unncessaray stop call') }
  // const defaultReset = (): void => {}

  // let reset = defaultReset
  const reset = () => {
    onRun = false;
  };

  const handleTimeUpdate = (time: Ticker) => {
    if (!onRun) {
      timeUpdate.disconnect(handleTimeUpdate);
      // reset()
      return;
    }

    timer += fixedTimestamp * time.deltaTime;

    if (timer > _periods[idx]) {
      fn(idx);

      idx += 1;
      timer = 0;

      if (idx >= _periods.length) {
        if (reps === undefined || reps > 1) {
          idx = 0;
          timer = 0;

          if (reps !== undefined) reps -= 1;
        } else {
          onRun = false;
          timeUpdate.disconnect(handleTimeUpdate);
          // reset()
          return;
        }
      }
    }
  };

  const run = () => {
    reps = repeats;
    onRun = true;
    timer = 0;
    idx = 0;
    timeUpdate.connect(handleTimeUpdate);
  };

  return {
    start: () => run(),
    reset: () => reset(),
  };
}

export interface ContinuousTimer {
  start: () => void;
  reset: () => void;
}

export type ContinuousTimerMaker = ReturnType<typeof getContinuousTimer>;

/**
 *
 * @param timeUpdate time update signal
 * @param fn - callback to be called at each frame during the period
 * @param period - period in seconds
 * @param repeats - if defined - amoutn of repeats; if undefined - infinite
 * @returns - ContinuousTimer
 */
export function getContinuousTimer(
  timeUpdate: Signal<Ticker>,
  fn: (t: number) => void,
  period: number,
  repeats?: number,
): ContinuousTimer {
  let timer = 0;
  let onRun = false;
  let reps = repeats;

  const defaultStop = (): void => {
    throw new Error("ContinuousTimer: unnecessary stop call");
  };

  let stop = defaultStop;

  const handleTimeUpdate = (time: Ticker) => {
    if (!onRun) {
      timeUpdate.disconnect(handleTimeUpdate);
      return;
    }

    fn(timer / period);
    timer += fixedTimestamp * time.deltaTime;

    if (timer > period) {
      fn(1.0);

      if (reps === undefined || reps > 1) {
        timer = 0;
        if (reps !== undefined) reps -= 1;
      } else if (reps !== undefined && reps <= 1) {
        stop();
      }
    }
  };

  const start = (): void => {
    if (onRun) throw new Error("ContinuousTimer: unncessary run call");

    onRun = true;
    timer = 0;
    reps = repeats;
    timeUpdate.connect(handleTimeUpdate);

    stop = () => {
      onRun = false;
      stop = defaultStop;
    };
  };

  return {
    start,
    reset: () => stop(),
  };
}
