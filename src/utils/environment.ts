import { Property } from "../core/property";
import { getControls } from "../controls";
import { App } from "../pixi/app";
import { WorldWrapper } from "../rapier/worldWrapper";
import { getRoutineManager } from "./timeRoutine/timeRoutine";

export type Environment = ReturnType<typeof makeEnv>;

export function makeEnv(pixiApp: App, world: WorldWrapper) {
  const physicsIsOn = new Property(false, (a, b) => a === b);

  pixiApp.timeUpdate.connect((time) => world.step(time.deltaTime));

  const controls = getControls();
  const routines = getRoutineManager();
  pixiApp.timeUpdate.connect(routines.handleTimeUpdate);

  const handleEnabled = (en: boolean): void => {
    pixiApp.timeUpdate.setConnection(en, world.handleTimeUpdate);
  };
  physicsIsOn.signal.connect(handleEnabled);
  physicsIsOn.set(true);

  const reset = (eanbleWorld: boolean): void => {
    pixiApp.reset();
    world.refreshWorld();
    routines.clear();

    pixiApp.timeUpdate.connect(routines.handleTimeUpdate);
    if (eanbleWorld) pixiApp.timeUpdate.connect(world.handleTimeUpdate);
  };

  return {
    world,
    app: pixiApp,
    controls,
    routines,

    physicsIsOn,
    reset,
  };
}
