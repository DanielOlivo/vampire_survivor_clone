// import { Property } from "../../core/property";
// import { getDirVelocity } from "../../utils/dirVelocity/dirVelocity";
// import { getTracer } from "../../utils/tracer/tracer";
// import { Props, Body } from "../body/body";
// import {
//   DynamicObject,
//   DynamicObjectConfig,
// } from "../dynamicObject/dynamicObject";
// import { Sensor, SensorConfig } from "../sensor/sensor";

// let id = 0;
// const getId = () => {
//   const result = id;
//   id += 1;
//   return result;
// };

// const notImplemented = () => {
//   throw new Error("dummy object: not implemented");
// };

// export function getDynamicObject(
//   env: GameObjectEnvironment,
//   config: DynamicObjectConfig,
// ): DynamicObject {
//   // const id = getId()
//   const body = getBody(env, config.bodyProps);
//   const dirVelocity = getDirVelocity(config.speed);

//   return {
//     getId: () => id,
//     body,
//     dirVelocity,
//     sprite: () => notImplemented(),

//     listenDir: () => {},
//     stopListenDir: () => {},
//     startFollowing: () => {},
//     stopFollowing: () => {},

//   };
// }

// export function getSensor(
//   env: GameObjectEnvironment,
//   config: SensorConfig,
// ): Sensor {
//   const id = getId();
//   const shape = new Property(config.shape);
//   const position = new Property(config.initPos ?? { x: 0, y: 0 });

//   return {
//     getId: () => id,
//     graphics: () => notImplemented(),
//     shape,
//     position,
//     handleShape: () => notImplemented(),
//     setEnable: () => notImplemented(),
//     enabled: () => notImplemented(),
//   };
// }

// export function getBody(env: GameObjectEnvironment, config: Props): Body {
//   const id = getId();
//   const position = new Property({ x: 0, y: 0 });
//   const linvel = new Property({ x: 0, y: 0 });

//   return {
//     getId: () => id,

//     graphics: () => notImplemented(),

//     setPosition: position.set,
//     getPosition: position.get,
//     position: position.signal,

//     linvel: linvel.signal,
//     setLinvel: linvel.set,

//     setEnable: (en: boolean) => {},
//   };
// }
