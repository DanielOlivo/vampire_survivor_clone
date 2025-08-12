import { Vector2 } from "@dimforge/rapier2d-compat";
import { Signal } from "../core/signal";
import { Parent } from "../paneDefinitions";

export function addVector2(
  pane: Parent,
  signal: Signal<Vector2>,
  label: string,
): void {
  const param = {
    v: { x: 0, y: 0 },
  };

  const binding = pane.addBinding(param, "v");
  binding.label = label;

  const handleUpdate = (v: Vector2) => {
    param.v.x = v.x;
    param.v.y = v.y;
    binding.refresh();
  };
  signal.connect(handleUpdate);
}

export function addVar<T>(
  pane: Parent,
  signal: Signal<T>,
  label: string,
  defaultValue: T,
): void {
  const param = {
    v: defaultValue,
  };

  const binding = pane.addBinding(param, "v", { readonly: true });
  binding.label = label;

  const handleUpdate = (v: T) => {
    param.v = v;
    binding.refresh();
  };
  signal.connect(handleUpdate);
}
