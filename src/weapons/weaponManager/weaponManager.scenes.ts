import { Property } from "../../core/property";
import { defaultEnemyConfigs } from "../../gameobjects/enemy/defaultEnemyTypes";
import { defaultSchedule } from "../../gameobjects/enemy/defaultSchedule";
import { getEnemyManager } from "../../gameobjects/enemy/enemyManager";
import { getPaneContainer } from "../../ui/paneContainer";
import { Scenes } from "../../ui/sceneType";
import { Environment } from "../../utils/environment";
import { cns, Level } from "../../utils/logger/cns";
import { getStaticTarget } from "../../utils/target/staticTarget";
import { getWeaponManager } from "./weaponManager";
import { addWeaponManagerPane } from "./weaponManager.pane";

export default {
  "weapon manager: scene": (env: Environment) => {
    cns.setCategories("weaponManager", "sword", "holyBible");
    cns.setLevel(Level.Trace);

    // const {pane, env: _env} = getPane(env)

    const target = getStaticTarget(env, env.app.containers.player);
    target.position.set({ x: 300, y: 300 });
    target.startEmitting();
    const direction = new Property({ x: 1, y: 0 });

    const em = getEnemyManager(
      env,
      defaultSchedule,
      defaultEnemyConfigs,
      target.position.signal,
    );

    const weaponManager = getWeaponManager(
      env,
      target.position.signal,
      direction.signal,
      // getEnemies,
      em,
    );

    const pane = getPaneContainer("weapon manager");
    addWeaponManagerPane(pane.pane, weaponManager);

    return {
      pane,
      usesWorld: true,
    };
  },
} satisfies Scenes;
