import { Scenes } from "../../ui/sceneType";
import { Environment } from "../../utils/environment";
import { getRandomPositionAtDonut } from "../../utils/randomPositionAtDonut";
import { getCollectableManager } from "../collectables/collectableManager";
import { defaultEnemyConfigs } from "../enemy/defaultEnemyTypes";
import { defaultSchedule } from "../enemy/defaultSchedule";
import { getEnemyManager } from "../enemy/enemyManager";
import { getProgressBar } from "../progressBar/progressBar";
import { getLevelController } from "./leveling/leveling";
import { defaultPlayerConfig, getPlayer } from "./player";

export default {
  "player: leveling": (env: Environment) => {
    const player = getPlayer(env, defaultPlayerConfig);
    const position = { x: 400, y: 400 };
    player.obj.body.setPosition(position);

    env.controls.startListening();
    player.obj.listenDir(env.controls.direction);

    const manager = getCollectableManager(env, player.obj.body.position);
    env.world.collisionManager.expItemGrab.connect(manager.handleGrab);
    env.world.collisionManager.expItemContact.connect(
      manager.handleAcquirement,
    );

    const levelController = getLevelController();
    const levelUi = getProgressBar(env.app.containers.ui, {
      width: 400,
      height: 30,
      initValue: 0,
      frontColor: "aqua",
      backColor: "black",
      alpha: 0.9,
    });
    levelUi.position.set({ x: 0, y: 0 });

    env.world.collisionManager.expItemContact.connect(
      levelController.handleAcquirement,
    );
    levelController.progressSignal.connect(levelUi.value.set);
    levelController.level.signal.connect((l) => console.log("level up: ", l));

    const spawnRoutine = function* () {
      while (true) {
        yield Math.random() * 2;
        manager.handleEnemyDeath(getRandomPositionAtDonut(position, 200, 300));
      }
    };
    env.routines.connect(spawnRoutine);

    return {
      pane: undefined,
      usesWorld: true,
    };
  },

  "player: getting hit": (env: Environment) => {
    const player = getPlayer(env, defaultPlayerConfig);
    player.obj.body.setPosition({ x: 300, y: 300 });

    const enemyManager = getEnemyManager(
      env,
      defaultSchedule,
      defaultEnemyConfigs,
      player.obj.body.position,
    );
    player.setupCollision(enemyManager.getEnemyById);
    env.world.collisionManager.enemyContact.connect(
      player.enemyContactHandler(),
    );

    enemyManager.createEnemy("medium");

    return {
      pane: undefined,
      usesWorld: true,
    };
  },
} satisfies Scenes;
