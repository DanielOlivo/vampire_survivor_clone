import { Environment } from "../../utils/environment";
import { Scenes } from "../sceneType";
import { getGameOverScreen } from "./gameOverScreen";

export default {
  "game over": (env: Environment) => {
    const screen = getGameOverScreen(env);

    screen.isEnabled.set(true);
    screen.clicked.connect(() => console.log("clicked!"));

    return {
      pane: undefined,
      usesWorld: false,
    };
  },
} satisfies Scenes;
