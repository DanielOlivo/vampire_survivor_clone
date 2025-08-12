// import { EventBus } from "./core/eventBus"
import { Vector2 } from "@dimforge/rapier2d-compat";
import { Signal } from "../core/signal";
import { V2 } from "./v2";
// import { Vector2 } from "./vector2";

export type Listener<T> = (event: T) => void;

export enum Direction {
  Up = 1,
  Down = 2,
  Left = 4,
  Right = 8,

  UpRight = 9,
  DownRight = 10,
  DownLeft = 6,
  UpLeft = 5,

  None = 0,
}

export function directionToVector(dir: Direction): Vector2 {
  let v: Vector2;

  switch (dir) {
    case Direction.UpRight:
      v = V2.normalized({ x: 1, y: -1 });
      break;
    case Direction.DownRight:
      v = V2.normalized({ x: 1, y: 1 });
      break;
    case Direction.DownLeft:
      v = V2.normalized({ x: -1, y: 1 });
      break;
    case Direction.UpLeft:
      v = V2.normalized({ x: -1, y: -1 });
      break;

    case Direction.Up:
      v = new Vector2(0, -1);
      break;
    case Direction.Down:
      v = new Vector2(0, 1);
      break;
    case Direction.Left:
      v = new Vector2(-1, 0);
      break;
    case Direction.Right:
      v = new Vector2(1, 0);
      break;

    default:
      v = { x: 0, y: 0 };
      break;
  }

  return v;
}

export class WASDcontrol {
  signal: Signal<Vector2> = new Signal();

  listenWASD = () => {
    let prevDir = 0;
    let dir = 0;

    window.addEventListener("keydown", (k: KeyboardEvent) => {
      switch (k.key) {
        case "w":
          dir = (dir & 1) === 0 ? (dir += 1) : dir;
          break;
        case "s":
          dir = (dir & 2) === 0 ? (dir += 2) : dir;
          break;
        case "a":
          dir = (dir & 4) === 0 ? (dir += 4) : dir;
          break;
        case "d":
          dir = (dir & 8) === 0 ? (dir += 8) : dir;
          break;
      }

      if (dir !== prevDir) {
        this.signal.emit(directionToVector(dir));
        // console.log('dir update', directionToVector(dir))
      }

      prevDir = dir;
    });

    window.addEventListener("keyup", (k: KeyboardEvent) => {
      switch (k.key) {
        case "w":
          dir = (dir & 1) === 1 ? (dir -= 1) : dir;
          break;
        case "s":
          dir = (dir & 2) === 2 ? (dir -= 2) : dir;
          break;
        case "a":
          dir = (dir & 4) === 4 ? (dir -= 4) : dir;
          break;
        case "d":
          dir = (dir & 8) === 8 ? (dir -= 8) : dir;
          break;
      }

      if (dir !== prevDir) this.signal.emit(directionToVector(dir));

      prevDir = dir;
    });
  };
}
