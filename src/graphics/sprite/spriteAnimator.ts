// import { Sprite } from "pixi.js";

// export function getSpriteAnimator(
//   env: GameObjectEnvironment,
//   sprite: Sprite,
//   spriteNames: string[],
//   frameDuration: number,
// ) {
//   const textures = spriteNames.map((name) => env.textures.getTexture(name));

//   const stageHandler = (i: number) => {
//     sprite.texture = textures[i];
//   };

//   const timer = env.timers.getPeriodicTimer(
//     stageHandler,
//     Array.from({ length: spriteNames.length }, () => frameDuration),
//   );

//   return {
//     start: timer.start,
//     reset: timer.reset,
//   };
// }
