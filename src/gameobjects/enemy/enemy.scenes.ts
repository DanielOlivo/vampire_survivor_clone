import { Environment } from "../../utils/environment";
import { getStaticTarget } from "../../utils/target/staticTarget";
import { getCollectableManager } from "../collectables/collectableManager";
import { defaultPlayerConfig, getPlayer } from "../player/player";
import { defaultEnemyConfigs } from "./defaultEnemyTypes";
import { defaultSchedule } from "./defaultSchedule";
import { getEnemyManager } from "./enemyManager";
import { getLevelController } from "../player/leveling/leveling";
import { getProgressBar } from "../progressBar/progressBar";
import { getPaneContainer } from "../../ui/paneContainer";
import { addEnemyPane } from "./enemy.pane";
import { Scenes } from "../../ui/sceneType";
import { addPlayerPane } from "../player/player.pane";

const scenes: Scenes = {
  "enemy: player, Enemy, Collectables": (env: Environment) => {
    const staticTarget = getStaticTarget(env, env.app.containers.entity);
    staticTarget.position.set({ x: 600, y: 200 });
    staticTarget.startEmitting();

    const playerTarget = getStaticTarget(env, env.app.containers.entity);
    const player = getPlayer(env, defaultPlayerConfig);
    player.obj.body.setPosition({ x: 100, y: 230 });

    const enemyManager = getEnemyManager(
      env,
      defaultSchedule,
      defaultEnemyConfigs,
      staticTarget.position.signal,
    );
    const collectableManager = getCollectableManager(
      env,
      player.obj.body.position,
    );
    enemyManager.deathPosition.connect(collectableManager.handleEnemyDeath);
    env.world.collisionManager.expItemGrab.connect(
      collectableManager.handleGrab,
    );
    env.world.collisionManager.expItemContact.connect(
      collectableManager.handleAcquirement,
    );

    const leveling = getLevelController();
    const progressBar = getProgressBar(env.app.containers.ui, {
      width: 400,
      height: 20,
      frontColor: "aqua",
      backColor: "black",
      alpha: 0.7,
      initValue: 0,
    });
    env.world.collisionManager.expItemContact.connect(
      leveling.handleAcquirement,
    );
    leveling.progressSignal.connect(progressBar.value.set);

    const updatePlayerTargetPosition = function* () {
      yield 0.2;
      let onLeft = true;
      while (true) {
        playerTarget.position.set({ x: onLeft ? 800 : 100, y: 230 });
        yield 8;
        onLeft = !onLeft;
      }
    };
    player.obj.startFollowing(playerTarget.position.signal);
    const spawnEnemies = function* () {
      yield 0.4;
      while (true) {
        const enemy = enemyManager.createEnemy("medium", { x: 100, y: 200 });
        enemy.obj.startFollowing(staticTarget.position.signal);
        yield 4;
      }
    };

    const damageEnemies = function* () {
      while (true) {
        yield 5;
        const enemies = enemyManager.utils.pool.values();
        const stats = Array.from(enemies ?? []).map((enemy) => enemy.stats);

        for (const stat of stats) {
          stat.handleDamage(40);
        }
      }
    };

    env.routines.connect(spawnEnemies);
    env.routines.connect(damageEnemies);
    env.routines.connect(updatePlayerTargetPosition);

    const pane = getPaneContainer("player, enemy, collectables");
    addPlayerPane(pane.pane, player);

    return {
      pane: pane,
      usesWorld: true,
    };
  },

  "enemy: damaging": (env: Environment) => {
    const pane = getPaneContainer("enemy");

    const target = getStaticTarget(env);
    target.position.set({ x: 200, y: 200 });
    target.startEmitting();

    const enemyManager = getEnemyManager(
      env,
      defaultSchedule,
      defaultEnemyConfigs,
      target.position.signal,
    );

    const enemy = enemyManager.createEnemy(defaultEnemyConfigs.medium.type);
    enemy.obj.body.setPosition({ x: 200, y: 200 });
    enemy.isDead.connect(() => console.dir(enemyManager.utils));

    addEnemyPane(pane.pane, enemy);

    const routine = function* () {
      while (enemy.stats.health.get() > 0) {
        yield 3;
        enemy.stats.handleDamage(10);
      }
    };
    env.routines.connect(routine);

    return {
      pane: pane,
      usesWorld: true,
    };
  },

  "enemy: spawning one": (env: Environment) => {
    const target = getStaticTarget(env);
    target.position.set({ x: 600, y: 200 });

    const enemyManager = getEnemyManager(
      env,
      defaultSchedule,
      defaultEnemyConfigs,
      target.position.signal,
    );

    const pane = getPaneContainer("spawning one");

    const routine = function* () {
      const initPos = { x: 200, y: 200 };
      const enemy = enemyManager.createEnemy("medium", initPos);
      addEnemyPane(pane.pane, enemy);

      while (true) {
        yield 4;
        console.log("damage");
        enemy.stats.handleDamage(100);
        yield 4;
        console.log("spawn");
        enemyManager.createEnemy("medium", initPos);
      }
    };

    env.routines.connect(routine);

    return {
      pane: pane,
      usesWorld: true,
    };
  },

  "enemy: spawining many": (env: Environment) => {
    // const pane = getPaneContainer('spawning many')

    const target = getStaticTarget(env);
    const position = { x: 500, y: 200 };
    target.position.set(position);
    target.startEmitting();

    const enemyManager = getEnemyManager(
      env,
      defaultSchedule,
      defaultEnemyConfigs,
      target.position.signal,
    );

    // addEnemyPicker(entities, enemyManager)
    // addEnemyManager(_env, enemyManager)

    const positions = getGridPositions();

    const spawn = function* () {
      yield 1;
      while (true) {
        const position = positions.next().value!;
        const enemy = enemyManager.createEnemy(
          defaultEnemyConfigs.medium.type,
          position,
        );
        // enemy.obj.body.setPosition(position)
        enemy.obj.stopFollowing();
        yield 3;
      }
    };

    const damaging = function* () {
      yield 3;
      while (true) {
        const enemies = enemyManager.utils.pool.values();
        for (const enemy of enemies) {
          enemy.stats.handleDamage(40);
        }
        yield 3;
      }
    };

    env.routines.connect(spawn);
    env.routines.connect(damaging);

    return {
      pane: undefined,
      usesWorld: true,
    };
  },
};

export default scenes;

function* getGridPositions(
  rows: number = 6,
  cols: number = 6,
  inf: boolean = true,
) {
  do {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        yield { x: 50 + 100 * col, y: 50 + 100 * row };
      }
    }
  } while (inf);
}
