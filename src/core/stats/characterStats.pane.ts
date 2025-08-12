import { Parent } from "../../paneDefinitions";
import { addVar } from "../../ui/paneUtils";
import { Stats } from "./characterStats";

export function addStatsPane(pane: Parent, stats: Stats): void {
  const folder = pane.addFolder({ title: "stats" });

  addVar(folder, stats.health.signal, "health", stats.health.get());
  addVar(folder, stats.isDead.signal, "isDead", stats.isDead.get());
}
