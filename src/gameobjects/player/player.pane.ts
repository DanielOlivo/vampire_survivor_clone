import { addStatsPane } from "../../core/stats/characterStats.pane";
import { Parent } from "../../paneDefinitions";
import { addDynamicObject } from "../../rapier/dynamicObject/dynamicObject.pane";
import { Player } from "./player";

export function addPlayerPane(pane: Parent, player: Player) {
  const folder = pane.addFolder({ title: "player" });

  addStatsPane(folder, player.stats);
  addDynamicObject(folder, player.obj);
}
