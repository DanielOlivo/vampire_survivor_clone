import { Sprite } from "pixi.js";
import { Environment } from "../../utils/environment";
// import { PeriodicTimer } from "../../utils/timers/timers";

/**
 *
 * @param env
 * @param sprite
 * @param color - white - default color (no effect)
 * @param period - period of tint (seconds)
 * @returns
 */
export function getSpriteTinter(
  env: Environment,
  sprite: Sprite,
  color: number | string,
  period: number,
) {
  // const handleStage = (i: number) => {
  //     sprite.tint = i === 0 ? color : 0xffffff
  // }

  const routine = function* () {
    sprite.tint = color;
    yield period;
    sprite.tint = 0xffffff;
  };

  const start = () => {
    env.routines.connect(routine);
  };
  // const timer: PeriodicTimer = env.app.timers.getPeriodicTimer(
  //     handleStage,
  //     [0, period],
  //     1
  // )

  return {
    // start: () => timer.start(),
    start,
    stop: () => {
      throw new Error("not implemented");
    },
    // stop: () => timer.reset()
  };
}
