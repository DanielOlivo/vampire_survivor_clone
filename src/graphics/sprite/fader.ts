import { Sprite } from "pixi.js";
import { Environment } from "../../utils/environment";
import { TimeGetter } from "../../utils/timeRoutine/timeRoutine";

export function getFader(env: Environment, sprite: Sprite, period: number) {
  const handleTimer = (t: number) => {
    sprite.alpha = 1 - t;
  };

  const timer = env.app.timers.getContinuousTimer(handleTimer, period, 1);

  const start = () => {
    sprite.alpha = 1;
    timer.start();
  };

  const reset = () => (sprite.alpha = 1);

  return {
    start,
    reset,
  };
}

export function getSpriteFader(sprite: Sprite, period: number) {
  return function* fade(tg: TimeGetter): Generator<number, void, unknown> {
    while (true) {
      const progress = tg() / period;
      if (progress < 0) return;
      sprite.alpha = 1 - progress;
      yield 0;
    }
  };
}
