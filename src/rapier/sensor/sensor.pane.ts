import { Parent } from "../../paneDefinitions";
import { addVar } from "../../ui/paneUtils";
import { Sensor } from "./sensor";

export function addSensorPane(pane: Parent, sensor: Sensor): void {
  const folder = pane.addFolder({ title: "sensor" });

  const params = {
    id: sensor.getId(),
  };

  folder.addBinding(params, "id", { readonly: true });
  addVar(folder, sensor.isEnabled.signal, "isEnabled", sensor.isEnabled.get());
}
