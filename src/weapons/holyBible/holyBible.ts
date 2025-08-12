import { Vector2 } from "@dimforge/rapier2d-compat";
import { Property } from "../../core/property";
import { fitRect, getSprite } from "../../graphics/sprite/spriteInstance";
import { Environment } from "../../utils/environment";
import { V2 } from "../../utils/v2";
import { Signal } from "../../core/signal";
import { collisionGroups } from "../../rapier/collisionGroups";
import { getSensor } from "../../rapier/sensor/sensor";
import { WeaponHitEvent } from "../../rapier/collisionManager/collisionManager";
import { Enemy } from "../../gameobjects/enemy/enemy";
import { upgradeConfig } from "./configs";
import { cns } from "../../utils/logger/cns";
import { HolyBible } from "../definitions";

export type HolyBibleConfig = {
  angularSpeed: number; // rotations per second
  radius: number;
  size: number;
  duration: number;
  recharge: number;
  count: number;

  attack: number;
};

export type HolyBibleItem = ReturnType<typeof getItem>;

export function getHolyBible(
  env: Environment,
  config: HolyBibleConfig,
  posSignal: Signal<Vector2>,
  getEnemy?: ((id: number) => Enemy) | undefined,
): HolyBible {
  const logger = cns.getInstance("holyBible");

  const isOn = new Property(false, (a, b) => a === b);
  const position = new Property({ x: 0, y: 0 });

  const items = Array.from({ length: config.count }, () =>
    getItem(env, config),
  );
  const handles = new Set(items.map((item) => item.sensor.getId()));

  const twoPi = 2 * Math.PI;
  const angleDelta = twoPi / config.count;

  const handleHit = (() => {
    if (!getEnemy) {
      return (ev: WeaponHitEvent) => {
        if (handles.has(ev.weaponId)) {
          logger.warning(
            () =>
              `handleHit: holyBible was initialized without enemy reference`,
          );
        }
      };
    }
    return ({ weaponId, enemyId, started }: WeaponHitEvent) => {
      if (!started || !handles.has(weaponId)) return;
      logger.trace(() => `hitting enemy with id ${enemyId}`);
      const enemy = getEnemy(enemyId);
      enemy.stats.handleDamage(config.attack);
    };
  })();

  const getPos = (idx: number, progress: number) => {
    let angle = angleDelta * idx + progress * twoPi;
    if (angle > twoPi) angle -= twoPi;

    const x = position.get().x + Math.cos(angle) * config.radius;
    const y = position.get().y + Math.sin(angle) * config.radius;
    return { x, y };
  };

  const handlePositions = (progress: number) => {
    for (const [idx, item] of items.entries()) {
      item.position.set(getPos(idx, progress));
    }
  };

  const routine = function* () {
    logger.debug(() => `starting routine`);
    isOn.set(true);

    posSignal.connect(position.set);
    items.forEach((item) => position.signal.connect(item.position.set));

    const timer = env.app.timers.getContinuousTimer(
      handlePositions,
      1 / config.angularSpeed,
    );
    timer.start();
    while (isOn.get()) {
      logger.trace(() => `turning on items`);
      items.forEach((item) => item.run());
      yield config.duration + config.recharge;
    }
    timer.reset();
    posSignal.disconnect(position.set);
    items.forEach((item) => position.signal.disconnect(item.position.set));
  };

  const run = () => {
    if (isOn.get()) {
      logger.warning(() => `run call while already running`);
      return;
    }
    env.routines.connect(routine);
  };

  const stop = () => {
    isOn.set(false);
  };

  const upgraded = () => {
    const newConfig = upgradeConfig(config);
    const newWeapon = getHolyBible(env, newConfig, posSignal, getEnemy);
    return newWeapon;
  };

  return {
    kind: "holyBible",

    position,
    run,
    stop,

    handleHit,
    isOn: {
      signal: isOn.signal,
      get: isOn.get,
    },
    upgraded,
  };
}

export function getItem(env: Environment, config: HolyBibleConfig) {
  const isEnabled = new Property(false, (a, b) => a === b);
  const position = new Property(V2.default());

  const sprite = getSprite(env, "holyBible", env.app.containers.player);

  const sensor = getSensor(env, {
    shape: { kind: "rect", width: config.size, height: config.size },
    collisionGroup: collisionGroups.weapon,
  });
  sensor.isEnabled.set(false);

  fitRect(sprite.sprite, config.size, config.size);

  const handleRun = function* () {
    const onTimer = env.app.timers.getContinuousTimer(
      (p: number) => (sprite.sprite.alpha = p),
      0.5,
      1,
    );
    onTimer.start();
    sensor.isEnabled.set(true);
    yield 0.5;
    sprite.sprite.alpha = 1;
    yield config.duration - 1;
    const offTimer = env.app.timers.getContinuousTimer(
      (p: number) => (sprite.sprite.alpha = 1 - p),
      0.5,
      1,
    );
    offTimer.start();
    yield 0.5;
    sensor.isEnabled.set(false);
  };

  const run = () => env.routines.connect(handleRun);

  const handleEnabled = (en: boolean) => {
    position.signal.setConnection(
      en,
      sprite.position.set,
      sensor.position.position.set,
    );

    if (en) {
      env.world.collisionManager.weaponHandles.add(sensor.getId());
    } else {
      env.world.collisionManager.weaponHandles.delete(sensor.getId());
    }
  };
  isEnabled.signal.connect(handleEnabled);

  isEnabled.set(true);

  return {
    isEnabled,
    position,
    sensor,
    run,
  };
}
