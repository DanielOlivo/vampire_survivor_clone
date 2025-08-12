import { CollisionGroup, collisionGroups } from "../../rapier/collisionGroups";
import { getSensor } from "../../rapier/sensor/sensor";
import { getDynamicObject } from "../../rapier/dynamicObject/dynamicObject";
import { getHealthBar } from "../../graphics/healthBar/healthBar";
import { getCharacterStats } from "../../core/stats/characterStats";
import { getSpriteTinter } from "../../graphics/sprite/tinter";
import { getDownScaler } from "../../graphics/sprite/downScaler";
import { Environment } from "../../utils/environment";
import { Enemy } from "../enemy/enemy";
import { EnemyContactEvent } from "../../rapier/collisionManager/collisionManager";
import { cns } from "../../utils/logger/cns";

type PlayerConfig = {
  speed: number;
  hitRadius: number;
  grabRadius: number;
};

export type Player = ReturnType<typeof getPlayer>;

export const defaultPlayerConfig: PlayerConfig = {
  speed: 3,
  hitRadius: 30,
  grabRadius: 60,
};

export function getPlayer(env: Environment, config: PlayerConfig) {
  const logger = cns.getInstance("player");

  // defining objects
  const obj = getDynamicObject(env, {
    speed: config.speed,
    spriteName: "adopt",
    bodyProps: {
      position: { x: 0, y: 0 },
      shape: { kind: "rect", width: 20, height: 40 },
      body: {
        isStatic: false,
        collisionGroup: collisionGroups.player,
      },
    },
  });

  const grabSensor = getSensor(env, {
    shape: { kind: "circle", radius: config.grabRadius },
    collisionGroup: collisionGroups.grabSensor,
  });

  const grabSensor2 = getSensor(env, {
    shape: { kind: "circle", radius: 3 },
    collisionGroup: collisionGroups.grabsensor2,
  });

  const hitSensor = getSensor(env, {
    shape: { kind: "circle", radius: config.hitRadius },
    collisionGroup: collisionGroups.hitSensor,
  });

  const healthBar = getHealthBar(env, {
    max: 100,
    init: 100,
    width: 30,
    height: 6,
  });

  const stats = getCharacterStats({
    attack: 0,
    attackInterval: 10000.0,
    shield: 1.0,
    id: obj.getId(),
    health: 100,
  });

  // position handling
  obj.body.position.connect(
    grabSensor.position.position.set,
    grabSensor2.position.position.set,
    hitSensor.position.position.set,
    healthBar.position.set,
  );
  healthBar.bias.set({ x: 0, y: 40 });
  stats.health.signal.connect(healthBar.value.set);

  // direction handling
  obj.listenDir(env.controls.direction);
  env.controls.direction.connect(obj.dirVelocity.dir.set);

  console.assert(
    typeof obj.body.getId() === "number",
    "problem with obj.body.getId",
  );

  (() => {
    const playerHandles = env.world.collisionManager.playerHandles;
    playerHandles.set(CollisionGroup.Player, obj.getId());
    playerHandles.set(CollisionGroup.PlayerSensor, hitSensor.getId());
    playerHandles.set(CollisionGroup.GrabSensor, grabSensor.getId());
    playerHandles.set(CollisionGroup.GrabSensor2, grabSensor2.getId());
  })();

  // env.statManager.addStats(hitSensor.getId(), stats)

  // handle damage
  const tinter = getSpriteTinter(env, obj.sprite().sprite, "red", 0.2);
  const showDamagedAnimation = () => tinter.start();

  const downScaler = getDownScaler(env, obj.sprite().sprite);
  // const showDeathAnimation = () => obj.sprite.scaleDown(1.0, false)
  const showDeathAnimation = () => downScaler.start();

  stats.damaged.connect(showDamagedAnimation);
  stats.isDead.signal.connect(showDeathAnimation);

  let handleEnemyContact: (ev: EnemyContactEvent) => void = () => {
    logger.warning(
      () => `should call 'handleEnemyContact: setupCollision' function`,
    );
  };
  const enemiesInContact = new Set<number>();

  const setupCollision = (getEnemy: (id: number) => Enemy): void => {
    handleEnemyContact = ({ enemy: id, started }: EnemyContactEvent) => {
      if (!started) {
        logger.trace(() => `enemy (${id}) out of contact`);
        enemiesInContact.delete(id);
        return;
      }
      logger.trace(() => `enenmy (${id}) in contact`);
      enemiesInContact.add(id);
      const enemy = getEnemy(id);
      const enemyStats = enemy.stats;
      const attack = enemyStats.attack.get();
      const interval = enemyStats.interval.get();

      const attackRoutine = function* () {
        while (enemiesInContact.has(id) && !enemy.stats.isDead.get()) {
          logger.trace(() => `getting damage from ${id}`);
          stats.handleDamage(attack);
          yield interval;
        }
      };
      env.routines.connect(attackRoutine);
    };
  };

  const toggleSensorGraphics = (en: boolean) => {
    grabSensor.graphics().isEnabled.set(en);
    hitSensor.graphics().isEnabled.set(en);
  };

  return {
    obj,
    healthBar,
    stats,
    toggleSensorGraphics,
    setupCollision,
    enemyContactHandler: () => handleEnemyContact,
    sensors: {
      hitSensor,
      grabSensor,
      grabSensor2,
    },
  };
}
