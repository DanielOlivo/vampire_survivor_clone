import { getDynamicObject } from "../../rapier/dynamicObject/dynamicObject";
import { collisionGroups } from "../../rapier/collisionGroups";
import { getCharacterStats } from "../../core/stats/characterStats";
import { getSpriteTinter } from "../../graphics/sprite/tinter";
import { getFader } from "../../graphics/sprite/fader";
import { Environment } from "../../utils/environment";
import { Signal } from "../../core/signal";
// import { Vector2 } from "@dimforge/rapier2d-compat";
// import { cns } from "../../utils/logger/cns";
import { Property } from "../../core/property";

// type EnemyConfig = Omit<DynamicObjectConfig, 'collisionGroup' | 'isStatic'>
export type EnemyConfig = {
  speed: number;
  spriteName: string;
  type: string;

  attack: number;
  attackInterval: number;
  shield: number;

  health: 60;
};

export type Enemy = ReturnType<typeof getEnemy>;

export const defaultEnemyConfig: EnemyConfig = {
  speed: 0,
  spriteName: "rogue2",
  type: "medium",
  attack: 10,
  attackInterval: 1.0,
  shield: 1.0,
  health: 60,
};

/**
 * puts instantly enemy to the scene
 * @param env - GameObjectEnvironment
 * @param config - enemy config
 * @returns - Enemy instance
 */
export function getEnemy(env: Environment, config: EnemyConfig) {
  // const logger = cns.getInstance("enemy");

  const { speed, spriteName, type, attack, attackInterval, shield, health } =
    config;

  const obj = getDynamicObject(env, {
    speed,
    spriteName,
    bodyProps: {
      position: { x: 0, y: 0 },
      shape: { kind: "rect", width: 20, height: 40 },
      body: {
        isStatic: false,
        collisionGroup: collisionGroups.enemy,
      },
    },
  });

  const stats = getCharacterStats({
    attack,
    attackInterval,
    shield,
    id: obj.getId(),
    health,
  });

  const isDead = new Signal<boolean>();

  // handle damage
  const tinter = getSpriteTinter(env, obj.sprite().sprite, "red", 0.2);
  const showDamagedAnimation = () => tinter.start();

  const fader = getFader(env, obj.sprite().sprite, 0.2);
  const showDeathAnimation = () => fader.start();

  const isEnabled = new Property(false, (a, b) => a === b);

  let onAutodisabling = false;
  let autoDisable: (dead: boolean) => void = () => {};

  const handleEnabled = (en: boolean) => {
    if (en) {
      stats.reset();
      env.world.collisionManager.enemyHandles.add(obj.getId());
      // env.statManager.addStats(obj.getId(), stats)
    } else {
      env.world.collisionManager.enemyHandles.delete(obj.getId());
      // env.statManager.removeStats(obj.getId())
    }
    stats.damaged.setConnection(en, showDamagedAnimation);
    stats.isDead.signal.setConnection(en, autoDisable);
  };
  isEnabled.signal.connect(handleEnabled);
  isEnabled.signal.connect(obj.isEnabled.set);

  const deathRoutine = function* () {
    onAutodisabling = true;
    env.world.collisionManager.enemyHandles.delete(obj.getId());
    showDeathAnimation();

    yield 1.2;
    isEnabled.set(false);
    isDead.emit(true);
  };

  autoDisable = (dead: boolean) => {
    if (!dead) return;

    env.routines.connect(deathRoutine);
  };

  isEnabled.set(true);

  const toConsole = () => ({
    id: obj.getId(),
    // enabled,
    isEnabled,
    onAutodisabling,
    position: obj.body.getPosition(),
    colliderIsEnabled: obj.body.isEnabled.get(),
    ...stats.toConsole(),
    objIsEnabled: obj.isEnabled.get(),
  });
  obj.sprite().setOnClick(toConsole);

  return {
    obj,
    stats,
    type,
    isDead,
    // setEnabled
    isEnabled,
  };
}
