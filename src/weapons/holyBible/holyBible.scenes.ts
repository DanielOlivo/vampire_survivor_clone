import { Property } from "../../core/property";
import { defaultEnemyConfigs } from "../../gameobjects/enemy/defaultEnemyTypes";
import { defaultSchedule } from "../../gameobjects/enemy/defaultSchedule";
import { getEnemyManager } from "../../gameobjects/enemy/enemyManager";
import { Scenes } from "../../ui/sceneType";
import { Environment } from "../../utils/environment";
import { defaultHolyBibleConfig } from "./configs";
import { getHolyBible, getItem } from "./holyBible";

export default {
  // upgrade: (env: Environment) => {
  //     const position = new Property({x: 400, y: 400})
  //     const weapon = getHolyBible(
  //         env,
  //         {...defaultHolyBibleConfig, angularSpeed: 0.4},
  //         position.signal
  //     )
  //     position.emit()
  //     weapon.run()

  //     const routine = function*() {
  //         while(true){
  //             yield 8
  //             console.log('upgrade')
  //             weapon.upgrade()
  //         }
  //     }
  //     env.routines.connect(routine)
  // },

  "holy bible: hitting Enemy": (env: Environment) => {
    const position = new Property({ x: 200, y: 200 });
    const weapon = getHolyBible(
      env,
      { ...defaultHolyBibleConfig, angularSpeed: 0.4 },
      position.signal,
    );
    position.emit();

    const enemyManager = getEnemyManager(
      env,
      defaultSchedule,
      defaultEnemyConfigs,
      position.signal,
    );

    const spawnEnemy = () => {
      const enemy = enemyManager.createEnemy("medium", { x: 240, y: 200 });
      enemy.obj.stopFollowing();
    };

    const spawnRoutine = function* () {
      yield 4;
      spawnEnemy();
    };

    enemyManager.deathPosition.connect(() =>
      env.routines.connect(spawnRoutine),
    );

    spawnEnemy();
    weapon.run();

    return {
      pane: undefined,
      usesWorld: true,
    };
  },

  initWeapon: (env: Environment) => {
    const position = new Property({ x: 200, y: 200 });
    const weapon = getHolyBible(
      env,
      { ...defaultHolyBibleConfig, angularSpeed: 0.4 },
      position.signal,
    );
    position.emit();

    weapon.run();

    return { pane: undefined, usesWorld: true };
  },

  item: (env: Environment) => {
    const item = getItem(env, defaultHolyBibleConfig);
    item.position.set({ x: 300, y: 300 });

    const routine = function* () {
      while (true) {
        item.run();
        yield 10;
      }
    };
    env.routines.connect(routine);
    return {
      usesWorld: true,
      pane: undefined,
    };
  },
} satisfies Scenes;
