import { Container, Graphics } from "pixi.js";
import { Property } from "../../core/property";
import { Vector2 } from "@dimforge/rapier2d-compat";
// import { Environment } from "../../utils/environment";

export type ProgressBarConfig = {
  width: number;
  height: number;

  initValue: number;

  frontColor: number | string;
  backColor: number | string;

  alpha: number;
};

export function getProgressBar(
  container: Container,
  config: ProgressBarConfig,
) {
  const { width, height, frontColor, backColor, alpha, initValue } = config;

  const value = new Property(initValue);
  const position = new Property({ x: 0, y: 0 });

  const _container = new Container();
  _container.alpha = alpha;

  const handlePosition = ({ x, y }: Vector2) => _container.position.set(x, y);

  const back = new Graphics().rect(0, 0, width, height).fill(backColor);
  const front = new Graphics()
    .rect(0, 0, Math.max(1, width * initValue), height)
    .fill(frontColor);
  _container.addChild(back, front);

  const handleUpdate = (valueUpd: number) => {
    front.width = Math.max(1, valueUpd * width);
  };

  let enabled = false;
  const setEnable = (en: boolean) => {
    if (en && !enabled) {
      container.addChild(_container);
      value.signal.connect(handleUpdate);
      position.signal.connect(handlePosition);

      handlePosition(position.get());
      handleUpdate(value.get());

      enabled = true;
    } else if (!en && enabled) {
      container.removeChild(_container);
      value.signal.disconnect(handleUpdate);
      position.signal.disconnect(handlePosition);
      enabled = false;
    }
  };

  setEnable(true);

  return {
    container,
    setEnable,

    position,
    value,
  };
}
