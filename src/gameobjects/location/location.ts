import { Vector2 } from "@dimforge/rapier2d-compat";
import { Environment } from "../../utils/environment";
import {
  getRandomGrassSprieName,
  getRandomWaterSpriteName,
} from "../../assets/sprites";
import { Container, Sprite } from "pixi.js";
import { Property } from "../../core/property";
import { getBody } from "../../rapier/body/body";
import { collisionGroups } from "../../rapier/collisionGroups";

export type Location = ReturnType<typeof getLocation>;
type LocationPart = ReturnType<typeof getLocationPart>;

export type LocationRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  isSolid: boolean;
};

export type LocationConfig = {
  grass: LocationRect[];
  water: LocationRect[];
  initOffset: Vector2;
};

const tileSize = 50;

export function getLocation(env: Environment, config: LocationConfig) {
  const parts: LocationPart[] = [];

  for (const locPart of config.water) {
    const part = getLocationPart(env, locPart, getRandomWaterSpriteName);
    parts.push(part);
  }

  for (const locPart of config.grass) {
    const part = getLocationPart(env, locPart, getRandomGrassSprieName);
    parts.push(part);
  }

  const {
    initOffset: { x, y },
  } = config;
  env.app.containers.tiles.position.set(x, y);

  return {
    parts,
  };
}

export function getLocationPart(
  env: Environment,
  rect: LocationRect,
  getSpriteName: () => string,
) {
  const isEnabled = new Property(false, (a, b) => a === b);

  const container = new Container();

  for (let y = 0; y < rect.height; y++) {
    for (let x = 0; x < rect.width; x++) {
      const texture = env.app.textures.getTexture(getSpriteName());
      const sprite = new Sprite(texture);
      sprite.anchor.set(0.5);
      sprite.position.set(tileSize * (rect.x + x), tileSize * (rect.y + y));
      container.addChild(sprite);
    }
  }

  const bodyOption = (() => {
    if (!rect.isSolid) return undefined;
    const body = getBody(
      env,
      {
        position: {
          x: tileSize * (rect.x + rect.width / 2) - tileSize / 2,
          y: tileSize * (rect.y + rect.height / 2) - tileSize / 2,
        },
        shape: {
          kind: "rect",
          width: rect.width * tileSize,
          height: rect.height * tileSize,
        },
        body: { isStatic: true, collisionGroup: collisionGroups.wall },
      },
      env.app.containers.tiles,
    );
    // body.graphics().isEnabled.set(true)
    body.graphics().graphics.zIndex = 10;
    return body;
  })();

  const handleEnabled = (en: boolean) => {
    if (en) {
      env.app.containers.tiles.addChild(container);
    } else {
      env.app.containers.tiles.removeChild(container);
    }
  };
  isEnabled.signal.connect(handleEnabled);
  if (bodyOption) isEnabled.signal.connect(bodyOption.isEnabled.set);

  isEnabled.set(true);

  return {
    container,
    isEnabled,
    bodyOption,
  };
}
