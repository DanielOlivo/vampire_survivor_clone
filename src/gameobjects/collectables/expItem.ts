import { Vector2 } from "@dimforge/rapier2d-compat";
import { Ticker } from "pixi.js";
import { getDynamicObject } from "../../rapier/dynamicObject/dynamicObject";
import { collisionGroups } from "../../rapier/collisionGroups";
import { Signal } from "../../core/signal";
import { Environment } from "../../utils/environment";
import { fitRect } from "../../graphics/sprite/spriteInstance";
import { cns } from "../../utils/logger/cns";
import { Property } from "../../core/property";

export enum ExpItemState {
  Idle = 0,
  Chase = 1,
}

export type ExpItemConfig = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  deltaVelocityChange: number;
};

export type ExpItem = ReturnType<typeof getExpItem>;

const fixedTimestamp = 1 / 60;

export function getExpItem(
  env: Environment,
  config: ExpItemConfig,
  { x, y }: Vector2,
) {
  const logger = cns.getInstance("expItem");

  const { radius, speed } = config;

  const obj = getDynamicObject(env, {
    speed,
    spriteName: "shard1",
    bodyProps: {
      position: { x, y },
      shape: { kind: "circle", radius },
      body: {
        isStatic: false,
        collisionGroup: collisionGroups.expItem,
      },
    },
  });
  const id = obj.getId();
  logger.setContext(id.toString());
  fitRect(obj.sprite().sprite, 20, 20);

  let onChase = false;

  const handleSpeedChange = (time: Ticker) => {
    const current = obj.dirVelocity.speed.get();
    const upd = Math.min(
      current + time.deltaTime * fixedTimestamp * config.deltaVelocityChange,
      speed,
    );
    obj.dirVelocity.speed.set(upd);
  };

  const defaultStopFollowing = (): void => {
    logger.warning(() => `expItem (${id}): unnecessary call of stopFollowing`);
  };
  let stopFollowing = defaultStopFollowing;

  const startFollowing = (posSignal: Signal<Vector2>) => {
    logger.debug(() => `startFollowing`);
    obj.startFollowing(posSignal);
    obj.dirVelocity.speed.set(-speed);
    env.app.timeUpdate.connect(handleSpeedChange);
    onChase = true;

    stopFollowing = () => {
      logger.debug(() => `stopFollowing`);
      obj.stopFollowing();
      onChase = false;
      env.app.timeUpdate.disconnect(handleSpeedChange);

      stopFollowing = defaultStopFollowing;
    };
  };

  const isEnabled = new Property(false, (a, b) => a === b);
  const handleEnabled = (en: boolean): void => {
    if (en) {
      obj.dirVelocity.speed.set(config.speed);
      env.world.collisionManager.expItemHandles.add(id);
    } else {
      stopFollowing();
      env.world.collisionManager.expItemHandles.delete(id);
    }
  };
  isEnabled.signal.connect(handleEnabled, obj.isEnabled.set);
  isEnabled.set(true);

  obj.sprite().setOnClick(() =>
    console.dir({
      speed: obj.dirVelocity.speed.get(),
      dir: obj.dirVelocity.dir.get(),
      onChase,
    }),
  );

  return {
    ...obj,
    isOnChase: () => onChase,
    startFollowing,
    stopFollowing: () => stopFollowing(),
    isEnabled,
  };
}
