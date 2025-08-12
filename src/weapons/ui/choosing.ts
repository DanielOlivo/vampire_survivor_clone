import { LayoutContainer, LayoutText } from "@pixi/layout/components";
import { Signal } from "../../core/signal";
import { Button } from "@pixi/ui";
import { Property } from "../../core/property";
import { Environment } from "../../utils/environment";
import { cns } from "../../utils/logger/cns";

export type Option<T> = {
  title: string;
  content: string;
  arg: T;
};

type ChooseButton<T> = ReturnType<typeof getButton<T>>;

export function getChoosePanel<T>(env: Environment) {
  const logger = cns.getInstance("choice");

  const isOn = new Property(false, (a, b) => a === b);
  const choice = new Signal<T>();

  const { width, height } = env.app.canvasSize();
  const container = new LayoutContainer({
    layout: {
      width,
      height,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  const showOptions = (options: Option<T>[]) => {
    logger.debug(() => `show options...`);
    logger.trace(() => options);
    const buttons: ChooseButton<T>[] = options.map((op) => getButton(op));
    const buttonContainer = getButtonContainer(buttons);

    const pressHandler = (arg: T) => {
      logger.debug(() => `choice: ${arg}`);
      container.removeChild(buttonContainer);
      env.app.containers.ui.removeChild(container);

      buttons.forEach((btn) => btn.pressed.disconnect(pressHandler));
      isOn.set(false);

      choice.emit(arg);
    };
    buttons.forEach((btn) => btn.pressed.connect(pressHandler));

    container.addChild(buttonContainer);
    isOn.set(true);
    env.app.containers.ui.addChild(container);
  };

  return {
    isOn: {
      signale: isOn.signal,
      get: isOn.get,
    },
    showOptions,
    choise: choice,
  };
}

function getButtonContainer<T>(buttons: ChooseButton<T>[]) {
  const container = new LayoutContainer({
    layout: {
      maxWidth: "50%",
      minHeight: "50%",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "stretch",
      backgroundColor: "blue",
    },
  });

  container.addChild(...buttons.map((b) => b.container));
  return container;
}

function getButton<T>({ title, content, arg }: Option<T>) {
  const pressed = new Signal<T>();

  const container = new LayoutContainer({
    layout: {
      flex: 1,
      width: "100%",
      minHeight: 10,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "deepskyblue",
      borderColor: "grey",
      borderWidth: 2,
    },
  });

  const titleComponent = new LayoutText({
    text: title,
    style: {
      fontSize: "30px",
      fill: "white",
    },
    layout: {
      flex: 1,
    },
  });

  const contentComponent = new LayoutText({
    text: content,
    style: {
      fontSize: "20px",
      fill: "white",
    },
    layout: {
      width: "100%",
      flex: 1,
    },
  });
  container.addChild(titleComponent, contentComponent);

  const button = new Button(container);
  button.onPress.connect(() => pressed.emit(arg));

  return {
    pressed,
    container,
  };
}
