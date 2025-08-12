import { Sprite } from "pixi.js";
import { getPaneContainer } from "../../ui/paneContainer";
import { Environment } from "../../utils/environment";
import { fitRect, getSprite } from "./spriteInstance";
import { addSpritePane } from "./spriteInstance.pane";
import { getSpriteTinter } from "./tinter";
import { getFader } from "./fader";

export default {
  position: (env: Environment) => {
    const pane = getPaneContainer("sprite position");

    const sprite = getSprite(env, "adopt");
    addSpritePane(pane.pane, sprite);

    const routine = function* () {
      while (true) {
        for (let i = 100; i < 300; i++) {
          sprite.position.set({ x: 100 + i, y: 100 });
          yield 0;
        }

        sprite.isEnabled.set(false);
        yield 2;
        sprite.isEnabled.set(true);
      }
    };
    env.routines.connect(routine);

    return {
      pane,
      usesWorld: false,
    };
  },

  "sprite: fitRect": (env: Environment) => {
    const sprites = Array.from(
      { length: 2 },
      () => new Sprite(env.app.textures.getTexture("medium2")),
    );
    sprites.forEach((s) => env.app.containers.entity.addChild(s));

    fitRect(sprites[0], 30, 30);
    sprites[0].position.set(20, 20);

    fitRect(sprites[1], 300, 300);
    sprites[1].position.set(100, 100);

    return {
      usesWorld: false,
      pane: undefined,
    };
  },

  "sprite: tint": (env: Environment) => {
    const sprite = getSprite(env, "adopt");
    sprite.position.set({ x: 200, y: 200 });

    const tinter = getSpriteTinter(env, sprite.sprite, "red", 1);

    const routine = function* () {
      while (true) {
        yield 3;
        tinter.start();
      }
    };
    env.routines.connect(routine);

    return {
      pane: undefined,
      usesWorld: false,
    };
  },

  "sprite: fader": (env: Environment) => {
    const sprite = getSprite(env, "adopt");
    sprite.position.set({ x: 200, y: 200 });

    const fader = getFader(env, sprite.sprite, 0.8);

    const routine = function* () {
      while (true) {
        yield 2;
        sprite.sprite.alpha = 1;
        yield 2;
        fader.start();
      }
    };
    env.routines.connect(routine);

    return {
      pane: undefined,
      usesWorld: false,
    };
  },
};
