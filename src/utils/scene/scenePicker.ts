import { ListBladeApi } from "tweakpane";
// import tileScenes from "../../gameobjects/tile/tile.scenes";
// import { Parent } from "../../paneDefinitions";
import { Environment } from "../environment";
import weaponManagerScenes from "../../weapons/weaponManager/weaponManager.scenes";
import { addVar } from "../../ui/paneUtils";
import { getPaneContainer, PaneContainer } from "../../ui/paneContainer";
import shapeScenes from "../../graphics/shape/shape.scenes";
import spriteInstanceScenes from "../../graphics/sprite/spriteInstance.scenes";
import enemyScenes from "../../gameobjects/enemy/enemy.scenes";
import playerScenes from "../../gameobjects/player/player.scenes";
import startScreenScenes from "../../ui/startScreen/startScreen.scenes";
import collectableScenes from "../../gameobjects/collectables/collectable.scenes";
import locationScenes from "../../gameobjects/location/location.scenes";
import holyBibleScenes from "../../weapons/holyBible/holyBible.scenes";
import gameOverScreenScenes from "../../ui/gameOverScreen/gameOverScreen.scenes";
import lightningScenes from "../../weapons/lightning/lightning.scenes";
import { Scenes } from "../../ui/sceneType";

type SceneParams = {
  usesWorld: boolean;
  pane: PaneContainer | undefined;
};

export function getScenePickerPane(env: Environment): void {
  const { pane } = getPaneContainer("scene picker");

  // const folder = pane.addFolder({title: 'environment'})

  const scenes = {
    ...shapeScenes,
    ...spriteInstanceScenes,
    ...enemyScenes,
    ...playerScenes,
    ...startScreenScenes,
    ...collectableScenes,
    ...weaponManagerScenes,
    ...locationScenes,
    ...holyBibleScenes,
    ...gameOverScreenScenes,
    ...lightningScenes,
  } satisfies Scenes;

  const params = {
    options: Object.keys(scenes).map((name) => ({ text: name, value: name })),
  };

  addVar(pane, env.physicsIsOn.signal, "physicsIsOn", env.physicsIsOn.get());

  const sceneSelector = pane.addBlade({
    view: "list",
    label: "scenes",
    options: params.options,
    value: Object.keys(scenes)[0],
  }) as ListBladeApi<keyof typeof scenes>;

  const currentSceneParams: SceneParams = {
    usesWorld: false,
    pane: undefined,
  };

  sceneSelector.on("change", (ev) => {
    env.reset(true);
    // env.app.reset()
    // env.world.refreshWorld()
    // env.app.timeUpdate.connect(env.routines.handleTimeUpdate)

    if (currentSceneParams.pane) currentSceneParams.pane.handleEnabled(false);

    const { pane, usesWorld } = scenes[ev.value](env);

    if (usesWorld) env.app.timeUpdate.connect(env.world.handleTimeUpdate);
    currentSceneParams.pane = pane;
    currentSceneParams.usesWorld = usesWorld;
  });
}
