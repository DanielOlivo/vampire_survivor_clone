import { Parent } from "../../paneDefinitions";
import { EnemyManager } from "./enemyManager";

export function addEnemyManager(pane: Parent, manager: EnemyManager) {
  const folder = pane.addFolder({
    title: "enemey manager",
  });

  const params = {
    pool: "",
    total: 0,
    onIdle: "",
    onIdleCount: 0,
  };
  const handler = () => {
    params.total = Array.from(manager.utils.pool.values()).length;
    params.onIdle = Array.from(manager.utils.onIdle).join(" ");
    params.onIdleCount = manager.utils.onIdle.size;
  };
  manager.enemySpawned.connect(handler);
  manager.deathPosition.connect(handler);

  folder.addBinding(params, "total", { readonly: true });
  folder.addBinding(params, "onIdle", { readonly: true });
  folder.addBinding(params, "onIdleCount", { readonly: true });

  return folder;
}
