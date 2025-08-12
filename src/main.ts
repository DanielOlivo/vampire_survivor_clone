import RAPIER from "@dimforge/rapier2d-compat";
import { makeEnv } from "./utils/environment";
import { getWorld } from "./rapier/worldWrapper";
import { getPixiApp } from "./pixi/app";
// import { getScenePickerPane } from "./utils/scene/scenePicker";
import { sceneController } from "./sceneController";
// import { getPaneContainer } from "./ui/paneContainer";
// import shapeScenes from "./graphics/shape/shape.scenes";

(async () => {
  await RAPIER.init();

  const world = getWorld(); // should be removed
  const pixiApp = await getPixiApp(); // this remains
  const env = makeEnv(pixiApp, world); // to scene builder

  // getScenePickerPane(env);
  // defaultScene(env)

  sceneController(env);
})();
