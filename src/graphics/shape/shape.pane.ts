import { Parent } from "../../paneDefinitions";
import { addVar, addVector2 } from "../../ui/paneUtils";
import { Shape } from "./shape";

export function addShape(pane: Parent, shape: Shape) {
  const folder = pane.addFolder({
    title: "shape",
  });

  addVector2(folder, shape.position.signal, "position");
  addVector2(folder, shape.bias.signal, "bias");
  addVar(folder, shape.isEnabled.signal, "isEnabled", shape.isEnabled.get());

  return folder;
}
