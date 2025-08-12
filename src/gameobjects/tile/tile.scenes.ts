import { grass, water } from "../../assets/sprites";
// import { getPane } from "../../ui/paneTest";
import { Environment } from "../../utils/environment";
import { getTile } from "./tile";
// import { addTilePane } from "./tile.pane";

export default {
  grass: (env: Environment) => {
    for (const [idx, name] of Object.keys(grass).entries()) {
      const position = { x: 100 + 50 * idx, y: 200 };
      getTile(
        env,
        {
          sprite: name,
          isSolid: false,
          rect: { kind: "rect", width: 50, height: 50 },
        },
        position,
      );
    }

    return true;
  },

  area: (env: Environment) => {
    const sprites = Array.from(Object.keys(grass));
    const getRandomSpriteName = () =>
      sprites[Math.floor(Math.random() * sprites.length)];

    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const position = { x: 100 + 50 * col, y: 100 + 50 * row };
        getTile(
          env,
          {
            sprite: getRandomSpriteName(),
            isSolid: false,
            rect: { kind: "rect", width: 50, height: 50 },
          },
          position,
        );
      }
    }

    return true;
  },

  waterArea: (env: Environment) => {
    const sprites = Array.from(Object.keys(water));
    const getRandomSpriteName = () =>
      sprites[Math.floor(Math.random() * sprites.length)];
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const position = { x: 100 + 50 * col, y: 100 + 50 * row };
        getTile(
          env,
          {
            sprite: getRandomSpriteName(),
            isSolid: false,
            rect: { kind: "rect", width: 50, height: 50 },
          },
          position,
        );
      }
    }
    return true;
  },
};
