import { Vector2 } from "@dimforge/rapier2d-compat";
import { getShape } from "../../graphics/shape/shape";
import { Environment } from "../environment";
import { cns, Level } from "../logger/cns";

const positions: Vector2[] = [
  { x: 200, y: 200 },
  { x: 500, y: 200 },
  { x: 500, y: 500 },
  { x: 200, y: 500 },
];

export function getTarget(env: Environment, period: number) {
  cns.setCategories("do");
  cns.setLevel(Level.Trace);

  const shape = getShape(env.app.containers.entity, {
    kind: "circle",
    radius: 30,
  });
  shape.isEnabled.set(true);

  const handlePeriod = (stage: number) => shape.position.set(positions[stage]);
  const timer = env.app.timers.getPeriodicTimer(
    handlePeriod,
    Array.from({ length: 4 }, () => period),
  );

  return {
    shape,
    timer,
  };
}
