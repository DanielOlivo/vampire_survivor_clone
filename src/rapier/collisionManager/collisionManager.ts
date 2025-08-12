import { SetProperty } from "../../core/SetProperty/SetProperty";
import { Signal } from "../../core/signal";
import { cns } from "../../utils/logger/cns";
import { CollisionGroup } from "../collisionGroups";
import { CollisionEvent } from "../worldWrapper";

export type CollisionManager = ReturnType<typeof getCollisionManager>;

export type EnemyContactEvent = {
  player: number; // do I need it?
  enemy: number;
  started: boolean;
};

export type WeaponHitEvent = {
  weaponId: number;
  enemyId: number;
  started: boolean;
};

export function getCollisionManager() {
  const logger = cns.getInstance("collisionManager");
  logger.setTableAsPreferred(true);

  const playerHandles = new Map<CollisionGroup, number>();

  const enemyHandles = new SetProperty<number>();
  const expItemHandles = new SetProperty<number>(); // should be a map handle - startFollowing function
  const weaponHandles = new SetProperty<number>();

  type ExpItemId = number;
  const expItemGrab = new Signal<ExpItemId>(); // only expItem handle needed
  const expItemContact = new Signal<ExpItemId>(); // only expItem handle needed

  const enemyContact = new Signal<EnemyContactEvent>();
  const weaponHit = new Signal<WeaponHitEvent>();

  const matchPlayerHandle = (
    handle1: number,
    handle2: number,
    group: CollisionGroup,
  ) => {
    if (!playerHandles.has(group)) return null;
    const handle = playerHandles.get(group)!;
    if (handle === handle1) return handle;
    if (handle === handle2) return handle;
    return null;
  };

  const matchHandle = (
    handle1: number,
    handle2: number,
    set: Set<number> | SetProperty<number>,
  ) => {
    if (set.has(handle1)) return handle1;
    if (set.has(handle2)) return handle2;
    return null;
  };

  const handleCollision = ({ handle1, handle2, started }: CollisionEvent) => {
    logger.trace(
      () =>
        `collision between ${handle1} and ${handle2} has ${started ? "started" : "ended"}`,
    );

    const playerHandle = matchPlayerHandle(
      handle1,
      handle2,
      CollisionGroup.Player,
    );
    const playerSensorHandle = matchPlayerHandle(
      handle1,
      handle2,
      CollisionGroup.PlayerSensor,
    );
    const grabSensorHandle = matchPlayerHandle(
      handle1,
      handle2,
      CollisionGroup.GrabSensor,
    );
    const grabSensor2Handle = matchPlayerHandle(
      handle1,
      handle2,
      CollisionGroup.GrabSensor2,
    );

    const enemyHandle = matchHandle(handle1, handle2, enemyHandles);
    const expItemHandle = matchHandle(handle1, handle2, expItemHandles);
    const weaponHandle = matchHandle(handle1, handle2, weaponHandles);

    const toLog = {
      playerHandle,
      playerSensorHandle,
      grabSensorHandle,
      grabSensor2Handle,
      enemyHandle,
      expItemHandle,
      weaponHandle,
    };
    logger.trace(() => toLog);
    // console.log(toLog)

    if (playerSensorHandle !== null && enemyHandle !== null) {
      logger.debug(() => `enemy contact ${started ? "STARTED" : "ENDED"}`);
      enemyContact.emit({
        player: playerSensorHandle,
        enemy: enemyHandle,
        started,
      });
    } else if (started && grabSensorHandle !== null && expItemHandle !== null) {
      logger.debug(() => `expItem (${expItemHandle}) was grabbed`);
      expItemGrab.emit(expItemHandle);
    } else if (
      started &&
      expItemHandle !== null &&
      grabSensor2Handle !== null
    ) {
      logger.debug(() => `expItem (${expItemHandle}) was acquired`);
      expItemContact.emit(expItemHandle);
    }

    if (started && weaponHandle !== null && enemyHandle !== null) {
      logger.debug(
        () => `weapon (${weaponHandle}) hits enemy (${enemyHandle}) `,
      );
      weaponHit.emit({
        enemyId: enemyHandle,
        weaponId: weaponHandle,
        started: true,
      });
    }
  };

  type TableRow = { name: string; ids: string };
  const toConsole = () => {
    const playerIds: TableRow[] = Array.from(playerHandles.entries()).map(
      ([name, handle]) => ({ name: name.toString(), ids: handle.toString() }),
    );
    const weapons: TableRow = {
      name: "weapons",
      ids: Array.from(weaponHandles).join(", "),
    };
    const enemies: TableRow = {
      name: "enemies",
      ids: Array.from(enemyHandles).join(", "),
    };
    const expItems: TableRow = {
      name: "exp",
      ids: Array.from(expItemHandles).join(", "),
    };

    return playerIds.concat([weapons, enemies, expItems]);
  };

  return {
    // setPlayerHandle, setPlayerSensorHandle, setGrabSensorHandle,
    playerHandles,

    enemyHandles,
    handleCollision,
    expItemHandles,
    expItemGrab,
    expItemContact,
    weaponHandles,

    enemyContact,
    weaponHit,

    toConsole,
  };
}
