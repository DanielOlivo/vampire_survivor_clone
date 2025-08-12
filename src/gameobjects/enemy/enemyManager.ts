import { Vector2 } from "@dimforge/rapier2d-compat";
import { Schedule } from "./defaultSchedule";
import { getScheduler } from "./scheduler";
import { getSpawnArea } from "./spawnArea";
import { getEnemy, type Enemy } from "./enemy";
import { EnemyConfigs } from "./defaultEnemyTypes";
import { Signal } from "../../core/signal";
import { Environment } from "../../utils/environment";
import { cns } from "../../utils/logger/cns";
import { Map2Property } from "../../core/Map2Property/Map2Property";

type EnemyCreator = (type: string, position?: Vector2) => Enemy;

export type EnemyManager = ReturnType<typeof getEnemyManager>;

export function getEnemyManager(
  env: Environment,
  schedule: Schedule,
  configs: EnemyConfigs,
  targetPosition: Signal<Vector2>,
) {
  const logger = cns.getInstance("enemyManager");
  type EnemyType = string;
  type Id = number;

  // const pool = new Map<EnemyType, Map<Id, Enemy>>()
  const pool = new Map2Property<EnemyType, Id, Enemy>();
  const onIdle = new Set<number>();

  const scheduler = getScheduler(env, schedule);
  const area = getSpawnArea(env, {
    donut: { kind: "donut", innerRadius: 200, outerRadius: 400 },
  });

  const deathPosition = new Signal<Vector2>();

  const enemySpawned = new Signal<Enemy>();

  const createEnemy: EnemyCreator = (type, position) => {
    logger.assert(
      type in configs,
      () => `Requested type (${type}) is missing in the configs`,
    );

    const enemyPosition = position ?? area.getRandomPosition();

    const enemy: Enemy = (() => {
      if (onIdle.size > 0) {
        const id = onIdle.values().next().value!;
        onIdle.delete(id);
        return pool.get(type, id)!;
      }

      const enemy = getEnemy(env, configs[type]);
      const id = enemy.obj.getId();
      pool.set(type, id, enemy);
      return enemy;
    })();

    const id = enemy.obj.getId();
    logger.debug(() => `set following`);

    const handleDeath = () => {
      logger.debug(() => `enemy (${id}) death handling`);
      enemy.isDead.disconnect(handleDeath);
      onIdle.add(id);
      logger.debug(() => `enemy (${id}) was returned to the pool`);
      deathPosition.emit(enemy.obj.body.getPosition());
    };
    enemy.isDead.connect(handleDeath);
    enemy.isEnabled.set(true);
    enemy.obj.body.setPosition(enemyPosition);
    enemy.obj.startFollowing(targetPosition);
    enemySpawned.emit(enemy);

    return enemy;
  };

  const getEnemyById = (id: number): Enemy => {
    logger.trace(() => `requesting enemy with id: ${id}`);
    return pool.getBySecondKey(id)!;
  };
  const enemies = function* () {
    for (const [, id, enemy] of pool.entries()) {
      if (!onIdle.has(id)) yield enemy;
    }
  };

  scheduler.spawnRequest.connect(createEnemy);

  const reset = () => {
    throw new Error("EnemyManager: reset - not implemented");
  };

  return {
    position: area.position,
    createEnemy,
    startSpawn: scheduler.start,
    enemySpawned,
    reset,

    deathPosition,

    getEnemyById,
    enemies,

    utils: {
      pool,
      onIdle,
    },
  };
}
