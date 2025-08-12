import { Vector2 } from "@dimforge/rapier2d-compat";
import { Signal } from "./core/signal";
import { V2 } from "./utils/v2";
import { Property } from "./core/property";

export enum State {
  OnMenu = 0,
  OnGame = 1,
}

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

export type ControlsConfig = {
  initState: State;
};

export type Controls = ReturnType<typeof getControls>;

export function getControls() {
  const dirProp = new Property<number>(0, (a: number, b: number) => a === b);

  const space = new Signal<void>();
  const escape = new Signal<void>();
  const direction = new Signal<Vector2>();

  dirProp.signal.connect((d) => direction.emit(directionToVector(d)));

  let stopListening = (): void => {};

  const startListening = () => {
    let dir = 0;

    const handleKeyDown = (k: KeyboardEvent) => {
      switch (k.key) {
        case "Escape":
          escape.emit();
          break;
        case " ":
          space.emit();
          break;

        case "w":
          dir = dir | 1;
          break;
        case "s":
          dir = dir | 2;
          break;
        case "a":
          dir = dir | 4;
          break;
        case "d":
          dir = dir | 8;
          break;
      }
      // console.log('keydown', dir)
      dirProp.set(dir);
    };

    const handleKeyUp = (k: KeyboardEvent) => {
      switch (k.key) {
        case "w":
          dir = dir & 14;
          break;
        case "s":
          dir = dir & 13;
          break;
        case "a":
          dir = dir & 11;
          break;
        case "d":
          dir = dir & 7;
          break;
      }
      // console.log('keyup', dir)
      dirProp.set(dir);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    stopListening = () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);

      stopListening = () => {};
    };
  };

  return {
    space,
    escape,
    direction,
    startListening,
    stopListening: () => stopListening(),
  };
}

function directionToVector(dir: Direction): Vector2 {
  let v: Vector2;

  switch (dir) {
    case Direction.UpRight:
      v = new Vector2(1, -1);
      break;
    case Direction.DownRight:
      v = new Vector2(1, 1);
      break;
    case Direction.DownLeft:
      v = new Vector2(-1, 1);
      break;
    case Direction.UpLeft:
      v = new Vector2(-1, -1);
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
      v = new Vector2(0, 0);
      break;
  }

  return V2.normalized(v);
}
