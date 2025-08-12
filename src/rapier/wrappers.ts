import { Vector2 } from "@dimforge/rapier2d-compat";
import { Signal } from "../core/signal";
import { PositionProperty } from "../utils/position";
import { Property } from "../core/property";

export interface BodyWrapper {
  kind: "bodyWrapper";
  id: number;
  position: Signal<Vector2>;
  setPosition: (pos: Vector2) => void;
  getPosition: () => Vector2;

  setLinvel: (linvel: Vector2) => void;
  linvel: Signal<Vector2>;
  getLinvel: () => Vector2;

  // setEnabled: (en: boolean) => void
  // isEnabled: () => boolean
  isEnabled: Property<boolean>;

  timeUpdateHandler: () => void;

  remove: () => void;

  // rigidBody: () => RigidBody
}

export interface SensorWrapper {
  id: number;
  position: PositionProperty;

  isEnabled: Property<boolean>;
  // isEnabled: () => boolean
  // setEnabled: (en: boolean) => void

  remove: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isBodyWrapper(obj: any): obj is BodyWrapper {
  return typeof obj === "object" && "kind" in obj && obj.kind === "bodyWrapper";
}
