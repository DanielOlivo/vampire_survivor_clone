import { Parent } from "../../paneDefinitions";
import { addVar, addVector2 } from "../../ui/paneUtils";
import { SpriteInstance } from "./spriteInstance";

export function addSpritePane(pane: Parent, sprite: SpriteInstance) {
  const folder = pane.addFolder({
    title: "sprite",
  });

  addVector2(folder, sprite.position.signal, "position");
  addVector2(folder, sprite.direction.signal, "direction");
  addVar(folder, sprite.isEnabled.signal, "isEnabled", sprite.isEnabled.get());
  folder.addBinding(sprite.sprite, "alpha", { readonly: true });

  return folder;
}
