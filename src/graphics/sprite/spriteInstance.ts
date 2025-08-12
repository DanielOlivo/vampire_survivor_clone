import { Container, Sprite } from "pixi.js";
import { Vector2 } from "@dimforge/rapier2d-compat";
import { Property } from "../../core/property";
import { V2 } from "../../utils/v2";
import { Environment } from "../../utils/environment";

export type SpriteInstance = ReturnType<typeof getSprite>;

/** fit sprite into given rectangle sizes */
export function fitRect(sprite: Sprite, width: number, height: number): void {
  const scale = Math.min(width / sprite.width, height / sprite.height);
  sprite.scale.set(scale);
}

/**
 * ENABLED by default
 * @param env - environment
 * @param textureName - name listed in `assets/sprites.ts`
 * @returns `SpriteInstance`
 */
export function getSprite(
  env: Environment,
  textureName: string,
  container?: Container,
) {
  const position = new Property({ x: 0, y: 0 }, V2.areEqual);
  const direction = new Property({ x: 1, y: 0 }, V2.areEqual);

  const sprite = new Sprite(env.app.textures.getTexture(textureName));
  sprite.anchor.set(0.5);

  let onClick = () => {};
  const setOnClick = (fn: () => void): void => {
    onClick = fn;
  };
  sprite.eventMode = "static";
  sprite.on("click", () => onClick());

  const handlePosition = ({ x, y }: Vector2) => {
    // console.log('setting sprite position', x)
    sprite.position.set(x, y);
  };

  const handleDirection = ({ x }: Vector2) => {
    if (x < 0.001 && x > -0.001) return;

    const { x: scaleX, y: scaleY } = sprite.scale;
    if (Math.sign(scaleX) !== Math.sign(x))
      sprite.scale.set(-1 * scaleX, scaleY);
  };

  const reset = () => {
    sprite.alpha = 1.0;
  };

  const _container = container ?? env.app.containers.entity;

  position.signal.name = "position"; // remove later

  const isEnabled = new Property(false, (a, b) => a === b);
  const handleEnable = (en: boolean) => {
    // console.log('sprite.handleEnable', en)
    if (en) {
      reset();
      _container.addChild(sprite);
      position.signal.connect(handlePosition);
      direction.signal.connect(handleDirection);
      // position.signal.manage()
      // direction.signal.manage()
    } else {
      position.signal.disconnect(handlePosition);
      direction.signal.disconnect(handleDirection);
      position.signal.manage();
      direction.signal.manage();
      _container.removeChild(sprite);
    }
  };
  isEnabled.signal.connect(handleEnable);
  isEnabled.set(true);

  return {
    sprite,

    position,
    direction,
    isEnabled,
    reset,

    setOnClick,
  };
}
