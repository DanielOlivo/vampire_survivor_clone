import { Parent } from "../../paneDefinitions";
import { addVector2 } from "../../ui/paneUtils";
import { Tracer } from "./tracer";

export function addTracerPane(pane: Parent, tracer: Tracer) {
  const folder = pane.addFolder({
    title: "tracer",
  });

  addVector2(folder, tracer.viewPoint.signal, "viewPoint");
  addVector2(folder, tracer.target.signal, "target");
  addVector2(folder, tracer.direction.signal, "direction");

  return folder;
}
