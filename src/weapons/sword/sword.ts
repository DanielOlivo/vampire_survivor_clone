import { Vector2 } from "@dimforge/rapier2d-compat";
import { Container, FillGradient, Graphics, Sprite } from "pixi.js";
import { getSensor } from "../../rapier/sensor/sensor";
import { Property } from "../../core/property";
import { V2 } from "../../utils/v2";
import { upgradeSwordConfig, type SwordConfig } from "./config";
import { Environment } from "../../utils/environment";
import { collisionGroups } from "../../rapier/collisionGroups";
import { TimeGetter } from "../../utils/timeRoutine/timeRoutine";
import { Enemy } from "../../gameobjects/enemy/enemy";
import { WeaponHitEvent } from "../../rapier/collisionManager/collisionManager";
import { cns } from "../../utils/logger/cns";
import { Sword } from "../definitions";
import { Signal } from "../../core/signal";

export type Swing = ReturnType<typeof getSwordSwing>;

export function getSword(
  env: Environment,
  config: SwordConfig,
  posSignal: Signal<Vector2>,
  dirSignal: Signal<Vector2>,
  getEnemy?: ((id: number) => Enemy) | undefined,
): Sword {
  const logger = cns.getInstance("sword");

  const { isDouble, secondStartDelay, duration, recharge } = config;

  const isOn = new Property(false, (a, b) => a === b);
  const position = new Property({ x: 0, y: 0 });
  const direction = new Property({ x: 1, y: 0 });

  const swings = [getSwordSwing(env, config, true)];

  if (isDouble) swings.push(getSwordSwing(env, config, false));

  const handles = new Set(swings.map((swing) => swing.sensor.getId()));
  logger.trace(() => `handles: [${Array.from(handles).join(", ")}]`);

  const handleHit = (() => {
    if (!getEnemy) {
      return (ev: WeaponHitEvent) => {
        if (handles.has(ev.weaponId))
          logger.warning(
            () =>
              `handleHit: sword was instantiated without reference to enemies`,
          );
      };
    }
    return ({ weaponId, enemyId, started }: WeaponHitEvent) => {
      logger.debug(() => `handleHit`);
      if (!handles.has(weaponId) || !started) {
        logger.trace(() => `dropping`);
        return;
      }

      const enemy = getEnemy(enemyId);
      logger.trace(() => `to call handleDamage(${config.attack})`);
      enemy.stats.handleDamage(config.attack);
    };
  })();

  const routine = function* () {
    logger.trace(() => "running routine");
    isOn.set(true);

    posSignal.connect(position.set);
    dirSignal.connect(direction.set);

    for (const swing of swings) {
      position.signal.connect(swing.position.set);
      direction.signal.connect(swing.direction.set);
    }

    while (isOn.get()) {
      logger.trace(() => `running front`);
      swings[0].makeSwing();
      if (swings.length > 1) {
        logger.trace(() => `running back`);
        yield config.secondStartDelay;
        swings[1].makeSwing();
      }
      yield duration + recharge - secondStartDelay;
    }

    posSignal.disconnect(position.set);
    dirSignal.disconnect(direction.set);

    for (const swing of swings) {
      position.signal.disconnect(swing.position.set);
      direction.signal.disconnect(swing.direction.set);
    }
  };

  const run = () => {
    if (isOn.get()) {
      logger.warning(() => `calling run but already on the run`);
      return;
    }
    env.routines.connect(routine);
  };

  const stop = () => isOn.set(false);

  const upgraded = (): Sword => {
    const newConfig = upgradeSwordConfig(config);
    const newSword = getSword(env, newConfig, posSignal, dirSignal, getEnemy);
    return newSword;
  };

  return {
    kind: "sword",

    position,
    direction,

    handleHit,

    run,
    stop,

    isOn: {
      signal: isOn.signal,
      get: isOn.get,
    },

    upgraded,
  };
}

/**
 * returns the single component of the sword weapon
 *
 */
export function getSwordSwing(
  env: Environment,
  config: SwordConfig,
  isFront: boolean,
) {
  // const isOn = new Property(false, (a, b) => a === b);

  const sensor = getSensor(
    env,
    {
      shape: { kind: "rect", width: 30, height: 60 },
      collisionGroup: collisionGroups.weapon,
    },
    env.app.containers.player,
  );
  // sensor.graphics().isEnabled.set(true)
  env.world.collisionManager.weaponHandles.add(sensor.getId());

  const arc: Sprite = (() => {
    const shape = new Graphics()
      .arc(0, 0, config.shape.height * 0.7, -Math.PI * 0.4, Math.PI * 0.3)
      .stroke({ width: 4, color: 0xffffff });
    const texture = env.app.app().renderer.generateTexture(shape);
    const sprite = new Sprite(texture);
    sprite.scale.set(1, 1);
    sprite.anchor.set(0.5);
    sprite.position.set(-10, 0);
    return sprite;
  })();

  const mask: Sprite = (() => {
    const gradient = new FillGradient({
      type: "linear",
      colorStops: [
        { offset: 0, color: 0x000000 },
        { offset: 1, color: 0xff0000 },
      ],
    });
    const shape = new Graphics().rect(0, 0, 60, 40).fill(gradient);
    const texture = env.app.app().renderer.generateTexture(shape);
    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.position.set(0, -60);
    return sprite;
  })();
  const container = new Container();
  arc.mask = mask;
  container.addChild(arc, mask);

  const position = new Property({ x: 0, y: 0 });
  const direction = new Property({ x: 1, y: 0 });

  const handleTotalPosition = (p: Vector2) => {
    const totalBias = {
      x: Math.sign(container.scale.x) * config.xBias,
      y: 0,
    };
    const totalPosition = V2.add(p, totalBias);
    container.position.set(totalPosition.x, totalPosition.y);
    sensor.position.position.set(totalPosition);
  };

  const handleDirection = ({ x }: Vector2) => {
    const { x: scaleX, y: scaleY } = container.scale;
    if (x === 0) return;
    if (Math.sign(x) * (isFront ? 1 : -1) !== Math.sign(scaleX))
      container.scale.set(-1 * scaleX, scaleY);
  };

  handleDirection({ x: 1, y: 0 });
  handleTotalPosition({ x: 0, y: 0 });
  // sensor.setEnable(false)
  sensor.isEnabled.set(false);

  sensor
    .graphics()
    .graphics.on("click", () =>
      console.dir({ position: sensor.position.totalPosition.get() }),
    );

  position.signal.connect(handleTotalPosition);
  direction.signal.connect(handleDirection);

  function* makeVisualSwing(getTime: TimeGetter) {
    env.app.containers.player.addChild(container);
    let time = 0;
    do {
      time = getTime();
      const progress = getTime() / config.duration;
      mask.position.set(0, -80 + progress * 180);
      yield 0;
    } while (time < config.duration);

    env.app.containers.player.removeChild(container);
    return;
  }

  function* makeSensorSwing(getTime: TimeGetter) {
    // sensor.setEnable(true)
    sensor.isEnabled.set(true);
    // sensor.graphics().setEnabled(true);
    sensor.graphics().isEnabled.set(true);

    let time = getTime();
    while (time < 0.8 * config.duration) {
      sensor.position.bias.set({
        x: 0,
        y: -40 + (80 * 1.5 * time) / config.duration,
      });
      yield 0;
      time = getTime();
    }

    // sensor.setEnable(false)
    sensor.isEnabled.set(false);
    // sensor.graphics().setEnabled(false)
    sensor.graphics().isEnabled.set(false);
    return;
  }

  const makeSwing = () => {
    env.routines.connect(makeVisualSwing, `visual swing: isFront ${isFront}`);
    env.routines.connect(makeSensorSwing, `sensor swing: isFront ${isFront}`);
  };

  const toConsole = () => {
    return {
      position: sensor.position.totalPosition.get(),
      width: config.shape.width,
      height: config.shape.height,
    };
  };
  arc.eventMode = "static";
  arc.on("click", () => console.dir(toConsole()));

  return {
    position,
    direction,

    sensor,

    makeSwing,
  };
}
