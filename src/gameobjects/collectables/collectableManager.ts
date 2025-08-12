import { Vector2 } from "@dimforge/rapier2d-compat";
import { getExpItem, type ExpItem } from "./expItem";
import { defaultConfig } from "./defaultConfig";
import { Signal } from "../../core/signal";
import { Environment } from "../../utils/environment";
import { cns } from "../../utils/logger/cns";

type EnemyDeathHandler = (pos: Vector2) => void;
type AcquirementHandler = (id: number) => void;

export interface CollectableManager {
  handleEnemyDeath: EnemyDeathHandler;
  handleAcquirement: AcquirementHandler;
}

export function getCollectableManager(
  env: Environment,
  playerPosition: Signal<Vector2>,
) {
  // playerPosition.connect(p => console.log(`collectableManager, playerpos: ${p}`))
  const logger = cns.getInstance("collectableManager");

  const pool = new Map<number, ExpItem>();
  const onIdle = new Set<number>();
  const grabbed = new Set<number>();

  const handleEnemyDeath = (pos: Vector2): ExpItem => {
    logger.debug(() => `handling enemy death at ${pos.x}, ${pos.y}`);
    const item: ExpItem = (() => {
      if (onIdle.size === 0) {
        logger.debug(() => `creating new expItem`);
        const config = defaultConfig;
        const item = getExpItem(env, config, pos);
        pool.set(item.getId(), item);
        return item;
      }
      logger.debug(() => `getting from pool`);
      const id = onIdle.values().next().value!;
      onIdle.delete(id);
      return pool.get(id)!;
    })();
    logger.trace(() => `enabling expItem (${item.getId()})`);
    // item.setEnable(true)
    item.isEnabled.set(true);
    item.body.setPosition(pos);

    // console.dir({
    //     rigidbodyEnabled: item.body._body.isEnabled.get()
    // })

    logger.debug(() => `item (${item.getId()}) created`);
    return item;
  };

  const handleGrab = (handle: number) => {
    logger.assert(pool.has(handle), () => `handleGrab id=${handle} - missing`);
    logger.assert(
      !onIdle.has(handle),
      () => `item ${handle} is onIdle but its collider enabled`,
    );
    if (grabbed.has(handle)) return;

    grabbed.add(handle);
    logger.debug(() => `handleGrab (${handle})`);
    const item = pool.get(handle)!;
    logger.assert(item !== undefined, () => `item (${handle}) is undefined`);
    logger.debug(() => `assigning target: ${playerPosition}`);
    item.startFollowing(playerPosition);
  };

  const handleAcquirement: AcquirementHandler = (id) => {
    logger.assert(
      !onIdle.has(id),
      () => `handleAcquirement call, but ${id} is not on the scene`,
    );
    if (!grabbed.has(id)) return;

    logger.debug(() => `returing expItem ${id} to pool`);
    grabbed.delete(id);
    const item = pool.get(id)!;
    onIdle.add(id);
    // item.setEnable(false)
    item.isEnabled.set(false);
    logger.trace(() => `expItem ${id} in pool`);
  };

  return {
    handleEnemyDeath,
    handleGrab,
    handleAcquirement,
  };
}
