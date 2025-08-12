import { Vector2 } from "@dimforge/rapier2d-compat";
import { Property } from "../core/property";
import { Environment } from "../utils/environment";
import { Signal } from "../core/signal";
import { V2 } from "../utils/v2";

export function getCamera(env: Environment) {
  const { stageContainer } = env.app.containers;

  const isOn = new Property(false, (a, b) => a === b);

  const defaultReset = () => {};
  let reset = defaultReset;

  const setAt = (positionSignal: Signal<Vector2>) => {
    const { width, height } = env.app.canvasSize();
    const delta1 = { x: width / 2, y: height / 2 };
    const handleTargetPosition = (p: Vector2) => {
      const { x, y } = V2.add(V2.rev(p), delta1);
      stageContainer.position.set(x, y);
    };
    positionSignal.connect(handleTargetPosition);
    isOn.set(true);

    reset = () => {
      positionSignal.disconnect(handleTargetPosition);
      reset = defaultReset;
      isOn.set(false);
    };
  };

  return {
    setAt,
    isOn: {
      signal: isOn.signal,
      get: isOn.get,
    },
    reset,
  };
}
