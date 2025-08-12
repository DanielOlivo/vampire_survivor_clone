import { Vector2 } from "@dimforge/rapier2d-compat";

export function getRandomPositionAtDonut(
  position: Vector2,
  innerRadius: number,
  outerRadius: number,
) {
  const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
  const angle = Math.PI * 2 * Math.random();

  return {
    x: radius * Math.cos(angle) + position.x,
    y: radius * Math.sin(angle) + position.y,
  };
}
