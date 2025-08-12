import { Parent } from "../../../paneDefinitions";
import { addVar } from "../../../ui/paneUtils";
import { LevelController } from "./leveling";

export function addLevelingPane(pane: Parent, leveling: LevelController) {
  const folder = pane.addFolder({ title: "level controller" });

  addVar(folder, leveling.level.signal, "level", leveling.level.get());
  addVar(
    folder,
    leveling.collected.signal,
    "collected",
    leveling.collected.get(),
  );
  addVar(
    folder,
    leveling.xpRequired.signal,
    "xp required",
    leveling.xpRequired.get(),
  );
}
