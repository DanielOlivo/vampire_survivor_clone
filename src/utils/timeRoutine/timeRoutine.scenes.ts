import { Container } from "pixi.js";
import { getShape } from "../../graphics/shape/shape";
import { Environment } from "../environment";
import { getRoutineManager, TimeGetter } from "./timeRoutine";
// import { getDebugPanel } from "../../ui/debug";

export default {
  movingCircles: (env: Environment) => {
    // const panel = getDebugPanel(env);
    // env.app.containers.ui.addChild(panel.container);

    const manager = getRoutineManager();
    env.app.timeUpdate.connect(manager.handleTimeUpdate);

    for (let i = 0; i < 5; i++) {
      const { routine } = getMovingCircle(
        env.app.containers.entity,
        50 + i * 50,
        2 ** i,
        20,
      );
      manager.connect(routine);
    }
  },

  generators: (env: Environment) => {
    const manager = getRoutineManager();
    manager.connect(routine1);
    // manager.connect(routine0)
    env.app.timeUpdate.connect(manager.handleTimeUpdate);

    manager.manage();
  },
};

function getMovingCircle(
  container: Container,
  yPos: number,
  period: number,
  steps: number,
) {
  const shape = getShape(container, { kind: "circle", radius: 10 });
  if (!shape.isEnabled.get()) shape.isEnabled.set(true);

  const state = {
    idx: 0,
    time: 0,
  };

  const getState = () => state;

  shape.graphics.on("click", () => console.table(getState()));

  function* moveCircles(getTime: TimeGetter) {
    for (let i = 0; i < steps; i++) {
      shape.position.set({ x: 100 + i * 50, y: yPos });
      state.idx = i;
      state.time = getTime();
      yield period;
    }
  }

  return {
    getState,
    routine: moveCircles,
  };
}

// function* routine0(getTime: TimeGetter) {
//   console.log("dude");
//   yield 0;
// }

function* routine1(getTime: TimeGetter) {
  while (getTime() < 4) {
    console.log("routine1: ", getTime());
    yield 1;
  }

  while (getTime() < 8) yield 4;

  while (getTime() >= 8 && getTime() <= 12) {
    console.log("routine1: ", getTime());
    yield 1;
  }
}
