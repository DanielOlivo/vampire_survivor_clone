// import { Vector2 } from "@dimforge/rapier2d-compat";
type Vector2 = { x: number; y: number };

export class V2 {
  static default(): Vector2 {
    return { x: 0, y: 0 };
  }

  static mag(v: Vector2) {
    return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
  }

  static normalized(v: Vector2): Vector2 {
    const mag = V2.mag(v);
    // if(mag > -0.001 && mag < 0.001) return new Vector2(0,0)
    if (mag === 0) return { x: 0, y: 0 };
    return { x: v.x / mag, y: v.y / mag };
  }

  static rev(v: Vector2): Vector2 {
    return { x: -v.x, y: -v.y };
  }

  static add(v1: Vector2, v2: Vector2): Vector2 {
    return { x: v1.x + v2.x, y: v1.y + v2.y };
  }

  static mulByScalar(v: Vector2, a: number): Vector2 {
    return { x: v.x * a, y: v.y * a };
  }

  static areEqual(v1: Vector2, v2: Vector2): boolean {
    return Math.abs(v2.x - v1.x) < 0.01 && Math.abs(v2.y - v1.y) < 0.01;
  }

  static randomNormalized(): Vector2 {
    // const mag = 1.0
    const angle = Math.random() * 2 * Math.PI;

    return { x: Math.cos(angle), y: Math.sin(angle) };
  }
}
