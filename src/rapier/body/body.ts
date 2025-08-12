import { Vector2 } from "@dimforge/rapier2d-compat";
import { Circle, Rect, getShape } from "../../graphics/shape/shape";
import { Environment } from "../../utils/environment";
import { Container } from "pixi.js";
import { Property } from "../../core/property";

export type Position = Vector2;

export type BodyProps = {
  isStatic: boolean;
  collisionGroup: number;
  // collisionGroup: {
  //     membership: number,
  //     filter: number
  // }
};

// export type Props<T extends Circle | Rect> = Position & BodyProps & T
export type Props = {
  position: Position;
  body: BodyProps;
  shape: Rect | Circle;
};

export type Body = ReturnType<typeof getBody>;

/**
 * physical object
 *
 * ENABLED by default; graphics is NOT
 *
 * graphics is controlled separately
 */
export function getBody(
  env: Environment,
  config: Props,
  container?: Container,
) {
  const { shape } = config;

  const _body = env.world.getBody(config);

  const graphics = getShape(container ?? env.app.containers.entity, shape);

  const isGraphicsEnabled = new Property(false, (a, b) => a === b);
  const isEnabled = new Property(false, (a, b) => a === b);

  const handleGraphicsEnabled = (en: boolean) => {
    graphics.isEnabled.set(en && isEnabled.get());
  };
  isGraphicsEnabled.signal.connect(handleGraphicsEnabled);

  const handleEnabled = (en: boolean) => {
    env.app.timeUpdate.setConnection(en, _body.timeUpdateHandler);
    _body.position.setConnection(en, graphics.position.set);
    if (en) _body.position.emitLatest();
    handleGraphicsEnabled(isGraphicsEnabled.get());
  };
  isEnabled.signal.connect(handleEnabled);
  isEnabled.signal.connect(_body.isEnabled.set);

  isEnabled.set(true);
  isGraphicsEnabled.set(false);

  return {
    getId: () => _body.id,
    graphics: () => graphics,
    isGraphicsEnabled,

    setPosition: _body.setPosition,
    getPosition: _body.getPosition,
    position: _body.position,
    linvel: _body.linvel,

    isEnabled,
    setLinvel: _body.setLinvel,

    _body,
  };
}
