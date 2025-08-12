import { Container } from "pixi.js";
import { Property } from "../../core/property";
import { getShape } from "../../graphics/shape/shape";
import { Environment } from "../environment";

/**
 * auxiliary object with position signal
 * @param env
 */
export function getStaticTarget(
  env: Environment,
  container?: Container,
  emitPeriod?: number,
) {
  const position = new Property({ x: 0, y: 0 });

  const shape = getShape(container ?? env.app.containers.entity, {
    kind: "circle",
    radius: 30,
  });
  position.signal.connect(shape.position.set);

  // const timer = env.app.timers.getPeriodicTimer(
  //   () => position.set(position.get()),
  //   0.1,
  // );

  const startEmitting = () => {
    const routine = function* () {
      while (true) {
        position.emit();
        yield emitPeriod ?? 1;
      }
    };
    env.routines.connect(routine);
  };

  return {
    position,
    shape,
    // startEmitting: () => timer.start()
    startEmitting,
  };
}
