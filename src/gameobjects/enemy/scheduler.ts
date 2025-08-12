import { Ticker } from "pixi.js";
import { Signal } from "../../core/signal";
import { Environment } from "../../utils/environment";

export type SpawnInterval = {
  startTime: number; // seconds
  stopTime: number; // seconds
  name: string;
  interval:
    | number
    | {
        min: number;
        max: number;
      }; // fixed interval value or random between min and max
};

export function getScheduler(env: Environment, intervals: SpawnInterval[]) {
  const spawnRequest = new Signal<string>();

  let onRun = false;

  const stop = () => {
    onRun = false;
  };
  const start = () => {
    onRun = true;

    const _intervals = intervals.map((i) => getInterval(i));

    let timer = 0;
    const fixedTimestamp = 1 / 60;
    const handleTimeUpdate = (time: Ticker) => {
      if (!onRun) {
        env.app.timeUpdate.disconnect(handleTimeUpdate);
        return;
      }

      timer += fixedTimestamp * time.deltaTime;

      for (const interval of _intervals) {
        if (interval.isNow(timer)) spawnRequest.emit(interval.interval.name);
      }
    };

    env.app.timeUpdate.connect(handleTimeUpdate);
  };

  return {
    spawnRequest,

    start,
    stop,
  };
}

function getInterval(interval: SpawnInterval) {
  const getNextSpawnTime = (() => {
    const i = interval.interval;
    if (typeof i === "number") return (time: number): number => time + i;
    else {
      const { max, min } = i;
      return (time: number): number => time + Math.random() * (max - min);
    }
  })();

  let nextRequest = getNextSpawnTime(interval.startTime);

  const isNow = (time: number) => {
    if (time > nextRequest) {
      nextRequest = getNextSpawnTime(time);
      return true;
    }
    return false;
  };

  return {
    isNow,
    interval,
  };
}
