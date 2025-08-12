import { Sprite } from "pixi.js";
import { getPeriodicTimer } from "./timers";
import { Environment } from "../environment";

export default {
  runWinfiniteTimer: (env: Environment) => {
    const positions = [
      { x: 200, y: 200 },
      { x: 400, y: 200 },
      { x: 400, y: 400 },
      { x: 200, y: 400 },
    ];

    const texture = env.app.textures.getTexture("adopt");
    const sprite = new Sprite(texture);
    env.app.containers.entity.addChild(sprite);
    sprite.anchor.set(0.5);

    const handlePosition = (i: number) => {
      const { x, y } = positions[i];
      sprite.position.set(x, y);
    };

    getPeriodicTimer(env.app.timeUpdate, handlePosition, [1, 2, 3, 1], 2);
  },
};
