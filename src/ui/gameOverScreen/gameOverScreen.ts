import { LayoutContainer, LayoutText } from "@pixi/layout/components";
import { Environment } from "../../utils/environment";
import { Signal } from "../../core/signal";
import { Button } from "@pixi/ui";
import { Property } from "../../core/property";

export function getGameOverScreen(env: Environment) {
  const canvasSize = env.app.canvasSize();

  const container = new LayoutContainer({
    layout: {
      width: canvasSize.width,
      height: canvasSize.height,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      // backgroundColor: 'blue'
    },
  });

  const clicked = new Signal<void>();

  const buttonView = new LayoutContainer({
    layout: {
      minHeight: 30,
      minWidth: 200,
      backgroundColor: "red",
    },
  });

  const label = new LayoutText({
    text: "to main menu",
    style: {
      fontSize: 30,
      fill: "white",
    },
    layout: {},
  });
  buttonView.addChild(label);
  container.addChild(buttonView);

  const button = new Button(buttonView);
  button.onPress.connect(() => {
    clicked.emit();
  });

  const isEnabled = new Property(false, (a, b) => a === b);
  const handleEnabled = (en: boolean) => {
    if (en) {
      env.app.containers.ui.addChild(container);
    } else {
      env.app.containers.ui.removeChild(container);
    }
  };
  isEnabled.signal.connect(handleEnabled);

  return {
    isEnabled,
    clicked,
  };
}
