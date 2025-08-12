import { Environment } from "../../utils/environment";
import { Scenes } from "../sceneType";
import { getStartScreen } from "./startScreen";

export default {
  "start screen scene": (env: Environment) => {
    const screen = getStartScreen(env);

    screen.startGame.connect(() => console.log("start screen clicked"));

    return {
      pane: undefined,
      usesWorld: false,
    };
  },
} satisfies Scenes;
