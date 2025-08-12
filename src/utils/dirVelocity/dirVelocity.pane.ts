import { Parent } from "../../paneDefinitions";
import { addVar, addVector2 } from "../../ui/paneUtils";
import { DirVelocity } from "./dirVelocity";

export function addDirVelocity(pane: Parent, dirVel: DirVelocity) {
  const folder = pane.addFolder({
    title: "dirVelocity",
  });

  addVar(folder, dirVel.speed.signal, "speed", dirVel.speed.get());
  addVector2(folder, dirVel.dir.signal, "dir");
  addVector2(folder, dirVel.linvel.signal, "linvel");

  return folder;
}
