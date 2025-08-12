import { Container, Graphics } from "pixi.js";
import { Environment } from "../../utils/environment";
import { Vector2 } from "@dimforge/rapier2d-compat";
import { Property } from "../../core/property";
import { Enemy } from "../../gameobjects/enemy/enemy";
import { cns } from "../../utils/logger/cns";
import { Lightning } from "../definitions";
import { upgradeLightning } from "./configs";
import { EnemyManager } from "../../gameobjects/enemy/enemyManager";

export type LightningConfig = {
  duration: number;
  recharge: number;

  count: number;
  attack: number;
};

// type RandomEnemyGetter = (count: number) => Enemy[];

export function getLightning(
  env: Environment,
  config: LightningConfig,
  // getEnemies: Generator<Enemy>,
  em: EnemyManager,
): Lightning {
  const logger = cns.getInstance("lightning");

  const isOn = new Property(false, (a, b) => a === b);

  const items = Array.from({ length: config.count }, () =>
    getItem(env, config),
  );

  const getNEnemies = (): Enemy[] => {
    const arr: Enemy[] = [];
    let count = 0;
    for (const enemy of em.enemies()) {
      if (count >= config.count) break;
      arr.push(enemy);
      count++;
    }

    return arr;
  };

  const run = () => {
    if (isOn.get()) {
      logger.warning(() => `attempt to run lightning which is already on`);
      return;
    }

    logger.debug(() => `running lightning`);
    isOn.set(true);

    const routine = function* () {
      while (isOn.get()) {
        const enemies = getNEnemies();
        logger.debug(() => `hitting ${enemies.length} enemies`);
        for (let i = 0; i < config.count; i++) {
          if (i >= enemies.length) break;
          const enemy = enemies[i];
          const item = items[i];

          const position = enemy.obj.body.getPosition();
          logger.trace(() => `at position ${position.x}, ${position.y}`);
          item.run(position);

          const stats = enemy.stats;
          const isDead = stats.handleDamage(config.attack);
          logger.trace(() =>
            isDead
              ? `killing ${enemy.obj.getId()}`
              : `hitting ${enemy.obj.getId()}`,
          );
        }
        yield config.duration + config.recharge;
      }
    };
    logger.debug(() => `running the routine`);
    env.routines.connect(routine);
  };

  const stop = () => {
    isOn.set(false);
  };

  const upgraded = () => {
    const newConfig = upgradeLightning(config);
    const newWeapon = getLightning(env, newConfig, em);
    return newWeapon;
  };

  return {
    kind: "lightning",
    run,
    stop,
    isOn: {
      signal: isOn.signal,
      get: isOn.get,
    },

    upgraded,
  };
}

export function getItem(env: Environment, config: LightningConfig) {
  const logger = cns.getInstance("ligthning");
  logger.setContext("item");

  const container = new Container();

  const graphics = new Graphics().moveTo(0, 0).lineTo(0, -700).stroke({
    width: 4,
    color: "white",
  });
  container.addChild(graphics);

  const run = ({ x, y }: Vector2) => {
    logger.trace(() => `running`);
    const routine = function* () {
      const parent = env.app.containers.entity;
      container.position.set(x, y);
      parent.addChild(container);
      yield config.duration;
      parent.removeChild(container);
    };
    env.routines.connect(routine);
  };

  return {
    container,
    run,
  };
}
