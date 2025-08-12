import { Vector2 } from "@dimforge/rapier2d-compat";
import { Property } from "../../core/property";
import { Environment } from "../../utils/environment";
import { getBody } from "../../rapier/body/body";
import { Rect } from "../../graphics/shape/shape";
import { collisionGroups } from "../../rapier/collisionGroups";
import { fitRect, getSprite } from "../../graphics/sprite/spriteInstance";

export type TileConfig = {
  sprite: string;
  isSolid: boolean;
  rect: Rect;
};

export type Tile = ReturnType<typeof getTile>;

export function getTile(
  env: Environment,
  config: TileConfig,
  initPos: Vector2,
) {
  const position = new Property(initPos);
  const isEnabled = new Property(false, (a, b) => a === b);
  const sprite = getSprite(env, config.sprite, env.app.containers.tiles);

  fitRect(sprite.sprite, config.rect.width, config.rect.height);

  const bodyOption = (() => {
    if (!config.isSolid) return undefined;

    const body = getBody(
      env,
      {
        position: initPos,
        shape: config.rect,
        body: { isStatic: true, collisionGroup: collisionGroups.wall },
      },
      env.app.containers.tiles,
    );

    isEnabled.signal.connect(body.isEnabled.set);

    return body;
  })();

  const handleEnabled = (en: boolean) => {
    position.signal.setConnection(en, sprite.position.set);
    if (bodyOption !== undefined)
      position.signal.setConnection(en, bodyOption.setPosition);
    position.emit();
  };
  isEnabled.signal.connect(handleEnabled);
  isEnabled.signal.connect(sprite.isEnabled.set);

  isEnabled.set(true);

  return {
    position,
    isEnabled,
    sprite,
    bodyOption,
  };
}
