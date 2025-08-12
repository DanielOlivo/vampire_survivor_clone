// import { Vector2 } from "@dimforge/rapier2d-compat";
import { Property } from "../core/property";
import { V2 } from "./v2";

export type PositionProperty = ReturnType<typeof getPosition>;
type Vector2 = { x: number; y: number };

/**
 * component to handle both the target position and bias
 * @param initPos
 * @param initBias
 * @returns
 */
export function getPosition(
  initPos: Vector2 = { x: 0, y: 0 },
  initBias: Vector2 = { x: 0, y: 0 },
) {
  const position = new Property<Vector2>(initPos, V2.areEqual);
  const bias = new Property<Vector2>(initBias, V2.areEqual);

  const totalPosition = new Property<Vector2>(V2.add(initPos, initBias));

  const handleTotalPosition = (p: Vector2, b: Vector2) => V2.add(p, b);
  const handlePosition = (p: Vector2) =>
    totalPosition.set(handleTotalPosition(p, bias.get()));
  const handleBias = (b: Vector2) =>
    totalPosition.set(handleTotalPosition(position.get(), b));
  position.signal.connect(handlePosition);
  bias.signal.connect(handleBias);

  return {
    position,
    bias,
    totalPosition: {
      get: totalPosition.get,
      signal: totalPosition.signal,
    },
  };
}
