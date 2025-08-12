import { Sprite } from "pixi.js";
import { Environment } from "../../utils/environment";

export type DownScaler = ReturnType<typeof getDownScaler>;

/**
 * it doesn't handle position
 * how to reset properly?
 * */
export function getDownScaler(env: Environment, sprite: Sprite) {
  const { x: scaleX, y: scaleY } = sprite.scale;

  const handleTimer = (t: number) => sprite.scale.set(scaleX, scaleY * (1 - t));

  const continuousTimer = env.app.timers.getContinuousTimer(handleTimer, 3, 1);

  const start = () => {
    sprite.anchor.set(scaleX, 1.0);
    continuousTimer.start();
  };

  return {
    start,
    reset: () => continuousTimer.reset(),
  };
}
