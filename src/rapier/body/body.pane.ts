import { Parent } from "../../paneDefinitions";
import { addShape } from "../../graphics/shape/shape.pane";
import { addVar, addVector2 } from "../../ui/paneUtils";
import { Body } from "./body";

export function addBody(pane: Parent, body: Body) {
  const folder = pane.addFolder({
    title: "body",
  });

  addVector2(folder, body.position, "position");
  addVector2(folder, body.linvel, "linvel");
  addVar<boolean>(
    folder,
    body._body.isEnabled.signal,
    "isEnabled",
    body._body.isEnabled.get(),
  );
  addShape(folder, body.graphics());

  return folder;
}
