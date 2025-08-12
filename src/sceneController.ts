import { Property } from "./core/property";
import { defaultScene } from "./defaultScene";
import { getStartScreen } from "./ui/startScreen/startScreen";
import { Environment } from "./utils/environment";

export function sceneController(env: Environment) {
  type State = "none" | "onStart" | "onGame";

  const state = new Property<State>("none");

  const handleChange = (newState: State) => {
    env.reset(newState === "onGame");

    switch (newState) {
      case "onStart": {
        const startScreen = getStartScreen(env);
        startScreen.startGame.connect(() => {
          console.log("dude");
          state.set("onGame");
        });
        break;
      }

      case "onGame": {
        const scene = defaultScene(env);
        if (scene.isOver) {
          scene.isOver.connect(() => handleChange("onStart"));
        }
        break;
      }
    }
  };
  state.signal.connect(handleChange);

  state.set("onStart");
}
