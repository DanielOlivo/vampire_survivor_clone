import { collisionGroups } from "../rapier/collisionGroups";
import { getBody } from "../rapier/body/body";
import { getShape } from "../graphics/shape/shape";
import { Property } from "../core/property";
import { Environment } from "../utils/environment";

export interface WallConfig {
  x: number;
  y: number;

  width: number;
  height: number;
}

export type Wall = ReturnType<typeof getWall>;

export function getWall(env: Environment, config: WallConfig) {
  const { x, y, width, height } = config;
  const isEnabled = new Property(false, (a, b) => a === b);

  const body = getBody(env, {
    position: { x, y },
    shape: { kind: "rect", width, height },
    body: { isStatic: true, collisionGroup: collisionGroups.wall },
  });

  const shape = getShape(env.app.containers.entity, {
    kind: "rect",
    width,
    height,
  });

  const handleEnabled = (en: boolean) => {
    body.position.setConnection(en, shape.position.set);
  };

  isEnabled.signal.connect(
    handleEnabled,
    body.isEnabled.set,
    shape.isEnabled.set,
  );

  isEnabled.set(true);

  return {
    body,
    shape,
    isEnabled,
  };
}
