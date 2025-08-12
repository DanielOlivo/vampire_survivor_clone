import "@pixi/layout";
import { Application, Container, Ticker } from "pixi.js";
import { Signal } from "../core/signal";
import { TextureManager, useTextures } from "../graphics/textures";
import {
  characters,
  grass,
  items,
  sword,
  uiSprites,
  water,
  weapon,
} from "../assets/sprites";
import { getContinuousTimer, getPeriodicTimer } from "../utils/timers/timers";
import { LayoutSystemOptions } from "@pixi/layout";
import { Property } from "../core/property";
// import { LayoutSystem } from "@pixi/layout";

export type App = Awaited<ReturnType<typeof getPixiApp>>;

export async function getPixiApp() {
  const layout: LayoutSystemOptions = {
    layout: {
      autoUpdate: true,
      enableDebug: false,
      throttle: 100,
      debugModificationCount: 0,
    },
  };

  const application = new Application();
  await application.init({
    background: "#1088bb",
    resizeTo: window,
    antialias: true,
    layout,
  });
  document.getElementById("pixi-container")!.appendChild(application.canvas);

  const textures: TextureManager = await useTextures({
    ...characters,
    ...items,
    ...sword,
    ...grass,
    ...water,
    ...uiSprites,
    ...weapon,
  });

  const timeUpdate = new Signal<Ticker>();

  application.stage.layout = {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  };

  const stageContainer = new Container();
  const ui = new Container();
  const entity = new Container();
  const player = new Container();
  // const camera = new Container()
  const tiles = new Container();

  ui.label = "ui";
  entity.label = "entity";
  player.label = "player";
  tiles.label = "tiles";

  ui.zIndex = 100;
  player.zIndex = 80;
  entity.zIndex = 60;
  tiles.zIndex = 0;
  stageContainer.sortableChildren = true;

  stageContainer.addChild(entity, player, tiles);
  application.stage.addChild(stageContainer, ui);

  const clear = () => {
    for (const container of [ui, entity, player, tiles]) {
      container.removeChildren().forEach((child) => {
        child.destroy({ children: true, texture: true });
      });
    }
  };

  let timer = 0;
  const fixedTimestamp = 1 / 60;
  const handleTimeUpdate = (time: Ticker) => {
    timer += time.deltaTime * fixedTimestamp;
  };
  const getTime = () => timer;

  // let onPause = true
  const onPause = new Property(true, (a, b) => a === b);
  const handlePause = (isPaused: boolean) => {
    if (isPaused) {
      application.ticker.remove(timeUpdate.emit);
      application.ticker.remove(handleTimeUpdate);
    } else {
      application.ticker.add(timeUpdate.emit);
      application.ticker.add(handleTimeUpdate);
    }
  };
  onPause.signal.connect(handlePause);
  onPause.set(false);

  const togglePause = () => onPause.set(!onPause.get()); // setPause(!onPause)

  const canvasSize = () => ({
    width: application.canvas.width,
    height: application.canvas.height,
  });

  const reset = () => {
    clear();
    timeUpdate.clear();
    timer = 0;
  };

  return {
    app: () => application,
    canvasSize,
    timeUpdate,
    timers: {
      getPeriodicTimer: (
        fn: (i: number) => void,
        periods: number | number[],
        repeats?: number,
      ) => getPeriodicTimer(timeUpdate, fn, periods, repeats),

      getContinuousTimer: (
        fn: (t: number) => void,
        period: number,
        repeats?: number,
      ) => getContinuousTimer(timeUpdate, fn, period, repeats),
    },

    getTime,
    togglePause,
    onPause,

    textures,
    containers: { ui, entity, player, stageContainer, tiles },
    clear,
    reset,
  };
}
