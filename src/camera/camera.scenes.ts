import { getWall } from "../gameobjects/wall";
import { collisionGroups } from "../rapier/collisionGroups";
import { getDynamicObject } from "../rapier/dynamicObject/dynamicObject";
import { Environment } from "../utils/environment";
import { getCamera } from "./camera";

export default {
  dynObj: (env: Environment) => {
    const dynObj = getDynamicObject(env, {
      speed: 2.0,
      spriteName: "medium2",
      bodyProps: {
        position: { x: 0, y: 0 },
        shape: { kind: "rect", width: 30, height: 60 },
        body: { isStatic: false, collisionGroup: collisionGroups.player },
      },
    });

    getWall(env, { x: 200, y: 200, width: 100, height: 50 });

    env.controls.startListening();
    dynObj.listenDir(env.controls.direction);

    const camera = getCamera(env);
    camera.setAt(dynObj.body.position);
  },
};
