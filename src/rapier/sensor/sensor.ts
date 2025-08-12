import { Vector2 } from "@dimforge/rapier2d-compat";
import { Property } from "../../core/property";
import { Rect, Circle, getShape } from "../../graphics/shape/shape";
import { Container } from "pixi.js";
import { Environment } from "../../utils/environment";

export type Sensor = ReturnType<typeof getSensor>;

export type SensorConfig = {
  shape: Rect | Circle;
  initPos?: Vector2;
  collisionGroup: number;
};

export function getSensor(
  env: Environment,
  config: SensorConfig,
  container?: Container,
) {
  const shape = new Property(config.shape);
  const isEnabled = new Property(true, (a, b) => a === b);

  const collider = env.world.getSensor(config);

  const graphics = getShape(
    container ?? env.app.containers.entity,
    shape.get(),
  );
  collider.position.totalPosition.signal.connect(graphics.position.set);

  isEnabled.signal.connect(collider.isEnabled.set);
  isEnabled.signal.connect(graphics.isEnabled.set);

  return {
    getId: () => collider.id,
    graphics: () => graphics,

    shape,
    position: collider.position,

    isEnabled,
  };
}
