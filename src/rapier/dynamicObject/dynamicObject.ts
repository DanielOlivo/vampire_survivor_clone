import { Vector2 } from "@dimforge/rapier2d-compat";
import { getBody, Props as BodyProps } from "../body/body";
import { getTracer } from "../../utils/tracer/tracer";
import { getDirVelocity } from "../../utils/dirVelocity/dirVelocity";
import { Signal } from "../../core/signal";
import { getSprite } from "../../graphics/sprite/spriteInstance";
import { Environment } from "../../utils/environment";
import { Container } from "pixi.js";
import { cns } from "../../utils/logger/cns";
import { Property } from "../../core/property";

export type DynamicObject = ReturnType<typeof getDynamicObject>;

export type DynamicObjectConfig = {
  bodyProps: BodyProps;
  speed: number;
  spriteName: string;
};

/**
 * ENABLED by default
 * @param env
 * @param config - DynamicObjectConfig
 * @returns
 */
export function getDynamicObject(
  env: Environment,
  { speed, spriteName, bodyProps }: DynamicObjectConfig,
  container?: Container,
) {
  const logger = cns.getInstance("do");

  const body = getBody(env, bodyProps, container); // enabled by default

  // to control velocity of the body
  // always works
  const dirVelocity = getDirVelocity(speed);

  // dirVelocity.linvel.signal.connect(body.setLinvel)

  const sprite = getSprite(env, spriteName); // enabled by default

  type StopFn = () => void;
  const onFollowing = new Property(false);
  const tracer = getTracer();
  const emitTracerDirection = function* () {
    while (onFollowing.get()) {
      yield 0.3;
      tracer.direction.emit();
    }
    return;
  };

  let targetSig: Signal<Vector2> | undefined;
  const startFollowing = (targetPosSignal: Signal<Vector2>) => {
    logger.assert(!onFollowing, () => `setFollowing, but already following`);

    onFollowing.set(true);
    logger.debug(() => `startFollowing`);

    dirVelocity.speed.set(speed);
    body.position.connect(tracer.viewPoint.set);
    targetPosSignal.connect(tracer.target.set);
    tracer.direction.signal.connect(dirVelocity.dir.set);
    dirVelocity.linvel.signal.connect(body.setLinvel);

    body.position.emitLatest();
    targetPosSignal.emitLatest();

    env.routines.connect(emitTracerDirection);

    targetSig = targetPosSignal;
  };
  const stopFollowing = () => {
    logger.debug(() => "stopFollowing");

    body.position.disconnect(tracer.viewPoint.set);
    if (targetSig) targetSig.disconnect(tracer.target.set);
    tracer.direction.signal.disconnect(dirVelocity.dir.set);
    dirVelocity.linvel.signal.disconnect(body.setLinvel);

    dirVelocity.dir.set({ x: 0, y: 0 });
    body.setLinvel({ x: 0, y: 0 });

    onFollowing.set(false);
    logger.debug(() => "onFollowing = false");
  };

  const defaultStopListenDir = () => {
    logger.warning(() => `stopListenDir: unncessary call`);
  };
  let stopListenDir: StopFn = defaultStopListenDir;
  const onListenDir = new Property(false);

  const listenDir = (dirSignal: Signal<Vector2>) => {
    dirSignal.connect(dirVelocity.dir.set);
    dirVelocity.linvel.signal.connect(body.setLinvel);
    onListenDir.set(true);

    stopListenDir = () => {
      dirSignal.disconnect(dirVelocity.dir.set);
      stopListenDir = defaultStopListenDir;
      // stopListenDir = () => {}
      onListenDir.set(false);
    };
  };

  const isEnabled = new Property(false, (a, b) => a === b);

  const handleEnabled = (en: boolean) => {
    body.position.setConnection(en, sprite.position.set);
    body.linvel.setConnection(en, sprite.direction.set);
    dirVelocity.linvel.signal.setConnection(en, body.setLinvel);

    // if(en){
    //     body.position.emitLatest()
    // }

    if (!en && onFollowing.get()) stopFollowing();
    if (!en && onListenDir.get()) stopListenDir();
  };
  isEnabled.signal.connect(handleEnabled);
  isEnabled.signal.connect(sprite.isEnabled.set);
  isEnabled.signal.connect(body.isEnabled.set);

  isEnabled.set(true);

  return {
    getId: body.getId,
    body,
    dirVelocity,
    sprite: () => sprite,

    startFollowing,
    stopFollowing,
    // stopFollowing: () => stopFollowing(),

    listenDir,
    stopListenDir: () => stopListenDir(),

    isEnabled,

    onFollowing,
    onListenDir,

    tracer,
  };
}
