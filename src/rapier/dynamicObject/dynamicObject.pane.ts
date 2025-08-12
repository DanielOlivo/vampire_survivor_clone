import { addSpritePane } from "../../graphics/sprite/spriteInstance.pane";
import { Parent } from "../../paneDefinitions";
import { addVar } from "../../ui/paneUtils";
import { addDirVelocity } from "../../utils/dirVelocity/dirVelocity.pane";
import { addTracerPane } from "../../utils/tracer/tracer.pane";
import { addBody } from "../body/body.pane";
import { DynamicObject } from "./dynamicObject";

export function addDynamicObject(pane: Parent, dynObj: DynamicObject): void {
  const folder = pane.addFolder({
    title: `dynamic Object ${dynObj.getId()}`,
  });

  const props = {
    id: dynObj.getId(),
  };

  folder.addBinding(props, "id");
  addVar(folder, dynObj.isEnabled.signal, "isEnabled", dynObj.isEnabled.get());
  const bodyFolder = addBody(folder, dynObj.body);
  const dirVelFolder = addDirVelocity(folder, dynObj.dirVelocity);
  addVar(
    folder,
    dynObj.onFollowing.signal,
    "onFollowing",
    dynObj.onFollowing.get(),
  );
  addVar(
    folder,
    dynObj.onListenDir.signal,
    "onListenDir",
    dynObj.onListenDir.get(),
  );
  const tracerFolder = addTracerPane(folder, dynObj.tracer);
  const spriteFolder = addSpritePane(folder, dynObj.sprite());

  bodyFolder.expanded = false;
  dirVelFolder.expanded = false;
  tracerFolder.expanded = false;
  spriteFolder.expanded = false;
}
