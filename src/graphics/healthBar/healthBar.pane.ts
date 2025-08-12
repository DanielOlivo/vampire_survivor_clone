import { Parent } from "../../paneDefinitions";
import { addVar, addVector2 } from "../../ui/paneUtils";
import { HealthBar } from "./healthBar";

export function addHealthBarPane(pane: Parent, bar: HealthBar) {
  const folder = pane.addFolder({ title: "heatlh bar" });

  addVar(folder, bar.value.signal, "value", bar.value.get());
  addVector2(folder, bar.position.signal, "position");
  addVector2(folder, bar.bias.signal, "bias");
}
