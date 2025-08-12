import { getRandomGrassSprieName } from "../../assets/sprites";
import { getCamera } from "../../camera/camera";
import { Scenes } from "../../ui/sceneType";
import { Environment } from "../../utils/environment";
import { defaultPlayerConfig, getPlayer } from "../player/player";
import { getLocation, getLocationPart, LocationRect } from "./location";
import { simpleConfig } from "./locationConfigs";

export default {
  "location: rect": (env: Environment) => {
    const locRect: LocationRect = {
      x: 3,
      y: 3,
      width: 4,
      height: 5,
      isSolid: false,
    };

    getLocationPart(env, locRect, getRandomGrassSprieName);

    return {
      pane: undefined,
      usesWorld: false,
    };
  },

  "location: scene": (env: Environment) => {
    getLocation(env, simpleConfig);

    const player = getPlayer(env, { ...defaultPlayerConfig, speed: 10.0 });
    env.controls.startListening();
    player.obj.listenDir(env.controls.direction);
    player.obj.body.setPosition({ x: 200, y: 200 });

    const camera = getCamera(env);
    camera.setAt(player.obj.body.position);

    return {
      pane: undefined,
      usesWorld: false,
    };
  },
} satisfies Scenes;
