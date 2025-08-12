// import {
//   CollisionEvent,
//   Environment,
//   Environments,
//   GameObjectEnvironment,
// } from "./environment";
// import { Application, Container, Renderer, Ticker } from "pixi.js";
// import {
//   ColliderDesc,
//   RigidBody,
//   RigidBodyDesc,
// } from "@dimforge/rapier2d-compat";
// import { Signal } from "../core/signal";
// import { TextureManager, useTextures } from "../graphics/textures";
// import { characters, items, sword } from "../assets/sprites";
// import { getStatManager } from "../core/statManager";
// import { getCollisionManager } from "../rapier/collisionManager/collisionManager";
// import { Property } from "../core/property";
// import { PeriodicTimer, type ContinuousTimer } from "./timers/timers";
// import { getControls } from "../controls";
// import { Props } from "../rapier/body/body";
// // import { getBody } from "../rapier/dummyObject/dummyObjects";

// export async function makeDummyEnv(): Promise<Environments> {
//   const textures: TextureManager = await useTextures({
//     ...characters,
//     ...items,
//     ...sword,
//   });
//   const collisionManager = getCollisionManager();
//   const timeUpdate = new Signal<Ticker>();

//   const uiCont = new Container();
//   const playerCont = new Container();
//   const entityCont = new Container();

//   type ContinuousTimerMaker = (
//     fn: (t: number) => void,
//     period: number,
//     repeats?: number,
//   ) => ContinuousTimer;
//   const getContinuousTimer: ContinuousTimerMaker = (fn, period, repeats) => {
//     throw new Error("not implemented");
//   };

//   type PeriodicTimerMaker = (
//     fn: (i: number) => void,
//     periods: number | number[],
//     repeats?: number,
//   ) => PeriodicTimer;
//   const getPeriodicTimer: PeriodicTimerMaker = () => {
//     throw new Error("not implemented");
//   };

//   const _getBody = (env: GameObjectEnvironment, props: Props) =>
//     getBody(env, props);

//   const env: Omit<Environment, "world"> = {
//     app: () => {
//       throw new Error("dummy environment");
//     },
//     // world: () => ({
//     //     createRigidBody: (desc: RigidBodyDesc) => {},
//     //     createCollider: (desc: ColliderDesc, rb?: RigidBody) => {}
//     // }),
//     timeUpdate,
//     textures,
//     controls: getControls(),
//     collision: new Signal<CollisionEvent>(),
//     collisionManager: getCollisionManager(),
//     statManager: getStatManager(collisionManager, timeUpdate),
//     togglePause: () => {},
//     onPause: new Property(false),

//     timers: {
//       getContinuousTimer,
//       getPeriodicTimer,
//     },

//     environments: {
//       ui: uiCont,
//       player: playerCont,
//       entities: entityCont,
//     },
//   };

//   return {
//     env,
//     uiEnvironment: { ...env, container: uiCont },
//     playerEnvironment: { ...env, container: playerCont },
//     entitiesEnvironment: { ...env, container: entityCont },
//   };

//   throw new Error("not implemented");
// }
