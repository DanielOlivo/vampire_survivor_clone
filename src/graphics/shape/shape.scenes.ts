import { getPaneContainer } from "../../ui/paneContainer";
import { Environment } from "../../utils/environment";
import { getShape } from "./shape";
import { addShape } from "./shape.pane";

export default {
  shape: (env: Environment) => {
    const container = env.app.containers.entity;

    const shapes = [
      getShape(container, { kind: "circle", radius: 40 }),
      getShape(container, {
        kind: "rect",
        width: 100,
        height: 50,
      }),
      getShape(container, {
        kind: "donut",
        innerRadius: 50,
        outerRadius: 200,
      }),
    ];
    shapes.forEach((shape) => shape.isEnabled.set(true));

    const timer = env.app.timers.getContinuousTimer((t: number) => {
      for (let i = 0; i < shapes.length; i++)
        shapes[i].position.set({ x: 200 + t * 200, y: 100 + 150 * i });
    }, 4);

    timer.start();

    const pane = getPaneContainer("shapes");
    shapes.forEach((shape) => addShape(pane.pane, shape));

    return {
      usesWorld: false,
      pane,
    };
  },
};
