import { addStatsPane } from "../../core/stats/characterStats.pane";
import { Parent } from "../../paneDefinitions";
import { addDynamicObject } from "../../rapier/dynamicObject/dynamicObject.pane";
import { Enemy } from "./enemy";

export function addEnemyPane(pane: Parent, enemy: Enemy): void {
  const folder = pane.addFolder({
    title: "enemy",
  });

  addDynamicObject(folder, enemy.obj);
  addStatsPane(folder, enemy.stats);
}
