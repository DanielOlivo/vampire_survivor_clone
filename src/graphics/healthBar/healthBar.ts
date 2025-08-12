import { Vector2 } from "@dimforge/rapier2d-compat";
import { Container, Graphics } from "pixi.js";
import { Environment } from "../../utils/environment";
import { Property } from "../../core/property";

export type HealthBar = ReturnType<typeof getHealthBar>;

export interface HealthConfig {
  max: number;
  init: number;
  width: number;
  height: number;
}

export function getHealthBar(env: Environment, config: HealthConfig) {
  const { max, init, width, height } = config;

  const value = new Property(init);
  const position = new Property({ x: 0, y: 0 });
  const bias = new Property({ x: 0, y: 0 });

  const getBarWidth = () => (value.get() / max) * width;

  const container = new Container();
  const bg = new Graphics().rect(0, 0, width, height).fill(0xff0000);
  const bar = new Graphics().rect(0, 0, getBarWidth(), height).fill(0x00ff00);
  container.addChild(bg, bar);

  const updateValue = () => {
    bar.width = Math.max(1, getBarWidth());
  };

  const handleTotalPosition = (
    { x, y }: Vector2,
    { x: bx, y: by }: Vector2,
  ) => {
    container.position.set(x + bx - width / 2, y + by - height / 2);
  };
  const handlePosition = (p: Vector2) => handleTotalPosition(p, bias.get());
  const handleBias = (b: Vector2) => handleTotalPosition(position.get(), b);

  position.signal.connect(handlePosition);
  bias.signal.connect(handleBias);
  value.signal.connect(updateValue);

  let enabled = false;
  const setEnabled = (en: boolean) => {
    const _container = env.app.containers.player;
    if (en && !enabled) {
      _container.addChild(container);
      enabled = true;
    } else if (!en && enabled) {
      _container.removeChild(container);
      enabled = false;
    }
  };
  setEnabled(true);

  return {
    position,
    bias,
    value,

    setEnabled,
  };
}

export const defaultHealthBarConfig: HealthConfig = {
  max: 100,
  init: 100,
  width: 80,
  height: 20,
};
