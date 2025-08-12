import { Parent } from "../../paneDefinitions";
import { addVar, addVector2 } from "../../ui/paneUtils";
import { Tile } from "./tile";

export function addTilePane(pane: Parent, tile: Tile): void {
  const folder = pane.addFolder({ title: "tile" });

  addVar(folder, tile.isEnabled.signal, "isEnabled", tile.isEnabled.get());
  addVector2(folder, tile.position.signal, "position");
}
