import { Parent } from "../../paneDefinitions";
import { addSensorPane } from "../../rapier/sensor/sensor.pane";
import { addVector2 } from "../../ui/paneUtils";
import { Sword } from "../definitions";
import { Swing } from "./sword";

export function addSwordPane(pane: Parent, sword: Sword) {
  const folder = pane.addFolder({ title: "sword" });

  addVector2(folder, sword.position.signal, "position");
  addVector2(folder, sword.direction.signal, "direction");

  // for (const swing of sword.swings) addSwordSwingPane(folder, swing);
}

export function addSwordSwingPane(pane: Parent, swing: Swing): void {
  const folder = pane.addFolder({ title: "swing" });

  const params = {
    id: swing.sensor.getId(),
  };

  folder.addBinding(params, "id", { readonly: true });
  addVector2(folder, swing.position.signal, "position");
  addVector2(folder, swing.direction.signal, "direction");
  addSensorPane(folder, swing.sensor);
}
