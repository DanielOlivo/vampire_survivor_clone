import RAPIER, {
  ColliderDesc,
  World,
  RigidBody,
  Collider,
  Vector2,
} from "@dimforge/rapier2d-compat";
import { Signal } from "../core/signal";
import { Props } from "./body/body";
import { BodyWrapper, SensorWrapper } from "./wrappers";
import { Property } from "../core/property";
import { SensorConfig } from "./sensor/sensor";
import {
  CollisionManager,
  getCollisionManager,
} from "./collisionManager/collisionManager";
import { getPosition } from "../utils/position";
import { Ticker } from "pixi.js";

/**
 * motivation: to make possible working with vitest
 * as rapier is not ES library
 */
type BodyMaker = (props: Props) => BodyWrapper;
type SensorMaker = (config: SensorConfig) => SensorWrapper;

export type CollisionEvent = {
  handle1: number;
  handle2: number;
  started: boolean;
};

export interface WorldWrapper {
  collision: Signal<CollisionEvent>;
  collisionManager: CollisionManager;
  step: (deltaTime: number) => void;
  handleTimeUpdate: (time: Ticker) => void;
  getBody: BodyMaker;
  getSensor: SensorMaker;

  refreshWorld: () => void;
}

export function getWorld(): WorldWrapper {
  const gravity = { x: 0, y: 0 };
  let world = new RAPIER.World(gravity);
  const eventQueue = new RAPIER.EventQueue(true);
  const collision = new Signal<CollisionEvent>();
  const collisionManager = getCollisionManager();
  collision.connect(collisionManager.handleCollision);

  const refreshWorld = () => {
    world.free();
    world = new RAPIER.World(gravity);
  };

  let timeAcc = 0;
  const fixedTimestamp = 1 / 60;

  const step = (deltaTime: number) => {
    timeAcc += deltaTime;

    while (timeAcc >= fixedTimestamp) {
      world.step(eventQueue);
      timeAcc -= fixedTimestamp;
      eventQueue.drainCollisionEvents((handle1, handle2, started) =>
        collision.emit({ handle1, handle2, started }),
      );
    }
  };
  const handleTimeUpdate = (time: Ticker) => step(time.deltaTime);

  // }
  const bodyMaker: BodyMaker = (props) => getBody(world, props);
  const sensorMaker: SensorMaker = (config) => getSensor(world, config);

  return {
    collision,
    collisionManager,
    step,
    handleTimeUpdate,

    getBody: bodyMaker,
    getSensor: sensorMaker,

    refreshWorld,
  };
}

function getBody(world: World, props: Props) {
  const {
    position: { x, y },
    body: { isStatic, collisionGroup },
    shape,
  } = props;

  const rigidBody: RigidBody = (() => {
    const rigidBodyDesc = isStatic
      ? RAPIER.RigidBodyDesc.fixed().setTranslation(x, y)
      : RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y).lockRotations();
    const _rigidBody = world.createRigidBody(rigidBodyDesc);
    _rigidBody.setTranslation({ x, y }, true);
    return _rigidBody;
  })();

  const collider: Collider = (() => {
    const colliderDesc = (() => {
      switch (shape.kind) {
        case "rect":
          return RAPIER.ColliderDesc.cuboid(
            shape.width / 2,
            shape.height / 2,
          ).setCollisionGroups(collisionGroup);
        case "circle":
          return RAPIER.ColliderDesc.ball(shape.radius).setCollisionGroups(
            collisionGroup,
          );
      }
    })();
    return world.createCollider(colliderDesc, rigidBody);
  })();

  const position = new Property(rigidBody.translation());
  const linvel = new Property(rigidBody.linvel());

  const setPosition = (pos: Vector2) => {
    rigidBody.setTranslation(pos, true);
    position.set(pos);
  };

  const timeUpdateHandler = () => {
    position.set(rigidBody.translation());
    linvel.set(rigidBody.linvel());
  };

  const remove = () => {
    world.removeCollider(collider, false);
    world.removeRigidBody(rigidBody);
  };

  const isEnabled = new Property<boolean>(false, (a, b) => a === b);
  const handleEnabled = (en: boolean) => {
    rigidBody.setEnabled(en);
    collider.setEnabled(en);
  };
  isEnabled.signal.connect(handleEnabled);
  isEnabled.set(true);

  console.assert(
    typeof collider.handle === "number",
    "collider.handle is not a number",
  );

  const wrapped: BodyWrapper = {
    kind: "bodyWrapper",
    id: collider.handle,
    position: position.signal,
    linvel: linvel.signal,
    timeUpdateHandler,
    setPosition,
    getPosition: position.get,
    setLinvel: (lv: Vector2) => {
      rigidBody.setLinvel(lv, true);
    },
    getLinvel: linvel.get,

    isEnabled,

    remove,

    // rigidBody: () => rigidBody
  };

  return wrapped;
}

function getSensor(world: World, config: SensorConfig): SensorWrapper {
  const { shape: _shape, initPos = { x: 0, y: 0 }, collisionGroup } = config;

  const collider: Collider = (() => {
    const desc: ColliderDesc = (() => {
      const { x, y } = initPos;
      switch (_shape.kind) {
        case "circle":
          return RAPIER.ColliderDesc.ball(_shape.radius)
            .setSensor(true)
            .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
            .setTranslation(x, y)
            .setCollisionGroups(collisionGroup);
        case "rect":
          return RAPIER.ColliderDesc.cuboid(_shape.width / 2, _shape.height / 2)
            .setSensor(true)
            .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
            .setTranslation(x, y)
            .setCollisionGroups(collisionGroup);
      }
    })();
    return world.createCollider(desc);
  })();

  const position = getPosition();
  const handleTotalPosition = (p: Vector2) => collider.setTranslation(p);
  position.totalPosition.signal.connect(handleTotalPosition);

  const isEnabled = new Property(collider.isEnabled(), (a, b) => a === b);
  const handleEnabled = (en: boolean) => collider.setEnabled(en);
  isEnabled.signal.connect(handleEnabled);

  const remove = () => world.removeCollider(collider, false);

  return {
    id: collider.handle,
    position,
    isEnabled,
    remove,
  };
}
