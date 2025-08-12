import { Signal } from "../../core/signal";
import {
  LayoutContainer,
  LayoutSprite,
  LayoutText,
} from "@pixi/layout/components";
import { Property } from "../../core/property";
import { Environment } from "../../utils/environment";
import { Button } from "@pixi/ui";
import { cns } from "../../utils/logger/cns";

export type StartScreen = ReturnType<typeof getStartScreen>;

export function getStartScreen(env: Environment) {
  const isEnabled = new Property(false, (a, b) => a === b);
  const container = getMainContainer(env);
  const ui = getUI();
  container.addChild(ui.container);

  const handleEnabled = (en: boolean) => {
    const uiContainer = env.app.containers.ui;
    if (en) {
      uiContainer.addChild(container);
    } else {
      uiContainer.removeChild(container);
    }
  };
  isEnabled.signal.connect(handleEnabled);

  isEnabled.set(true);

  return {
    container,
    startGame: ui.startGamePressed,
  };
}

function getMainContainer(env: Environment) {
  const canvasSize = env.app.canvasSize();

  const container = new LayoutContainer({
    layout: {
      width: canvasSize.width,
      height: canvasSize.height,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  const texture = env.app.textures.getTexture("startBackground");
  const sprite = new LayoutSprite({
    texture,
    layout: {
      position: "absolute",
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  });

  container.addChild(sprite);

  return container;
}

function getUI() {
  const logger = cns.getInstance("startScreen");

  const startGamePressed = new Signal<void>();

  const container = new LayoutContainer({
    layout: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      rowGap: 60,
    },
  });

  const title = new LayoutText({
    text: "Vampire Survivors Like Demo",
    style: {
      fontSize: "30px",
      fill: "white",
    },
    layout: {
      minHeight: 50,
      minWidth: 200,
    },
  });

  const buttonView = new LayoutContainer({
    layout: {
      width: 200,
      height: 60,
      paddingTop: 8,
      paddingBottom: 8,
      backgroundColor: 0x440000,
    },
  });

  const startLabel = new LayoutText({
    text: "Start",
    style: {
      fill: "white",
    },
    layout: {},
  });
  buttonView.addChild(startLabel);

  const button = new Button(buttonView);
  container.addChild(title, buttonView);

  button.onPress.connect(() => {
    logger.debug(() => `start game button pressed`);
    startGamePressed.emit();
  });

  return {
    container,
    startGamePressed,
  };
}
