import { defaultEnemyConfigs } from "../../gameobjects/enemy/defaultEnemyTypes";
import { defaultSchedule } from "../../gameobjects/enemy/defaultSchedule";
import { getEnemyManager } from "../../gameobjects/enemy/enemyManager";
import { Scenes } from "../../ui/sceneType";
import { Environment } from "../../utils/environment";
import { cns, Level } from "../../utils/logger/cns";
import { getStaticTarget } from "../../utils/target/staticTarget";
import { defaultLightningConfig } from "./configs";
import { getLightning } from "./lightning";

export default {
  lightning: (env: Environment) => {
    cns.setCategories("lightning");
    cns.setLevel(Level.Trace);

    const target = getStaticTarget(env);
    target.position.set({ x: 300, y: 300 });
    target.startEmitting();

    const enemyMaanager = getEnemyManager(
      env,
      defaultSchedule,
      defaultEnemyConfigs,
      target.position.signal,
    );

    target.position.emit();

    const weapon = getLightning(
      env,
      {
        ...defaultLightningConfig,
        duration: 0.2,
        recharge: 10,
      },
      enemyMaanager,
    );

    const routine = function* () {
      while (true) {
        enemyMaanager.createEnemy("medium");
        yield 5;
      }
    };
    env.routines.connect(routine);
    weapon.run();

    return {
      usesWorld: true,
      pane: undefined,
    };
  },
} satisfies Scenes;
