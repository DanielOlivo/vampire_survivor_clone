import { Vector2 } from "@dimforge/rapier2d-compat";
import { Property } from "../../core/property";
import { V2 } from "../v2";

export type Tracer = ReturnType<typeof getTracer>;

export function getTracer() {
  const viewPoint = new Property<Vector2>({ x: 0, y: 0 });
  const target = new Property<Vector2>({ x: 0, y: 0 });
  const direction = new Property<Vector2>({ x: 0, y: 0 });

  const update = (view: Vector2, t: Vector2) =>
    direction.set(V2.normalized(V2.add(t, V2.rev(view))));

  const handleViewPointUpd = (v: Vector2) => update(v, target.get());
  const handleTargetUpd = (t: Vector2) => update(viewPoint.get(), t);

  viewPoint.signal.connect(handleViewPointUpd);
  target.signal.connect(handleTargetUpd);

  return {
    viewPoint,
    target,
    direction,
  };
}
