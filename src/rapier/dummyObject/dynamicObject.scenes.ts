import { getPane } from "../../ui/paneTest";
import { Environment } from "../../utils/environment";
import { getStaticTarget } from "../../utils/target/staticTarget";
import { getTarget } from "../../utils/target/target";
import { collisionGroups } from "../collisionGroups";
import {
  DynamicObjectConfig,
  getDynamicObject,
} from "../dynamicObject/dynamicObject";
import { addDynamicObject } from "../dynamicObject/dynamicObject.pane";

const defaultObjConfig: DynamicObjectConfig = {
  speed: 1.0,
  spriteName: "adopt",
  bodyProps: {
    position: { x: 200, y: 200 },
    shape: { kind: "rect", width: 30, height: 60 },
    body: {
      isStatic: false,
      collisionGroup: collisionGroups.player,
    },
  },
};

export default {
  enablingAndDisabling: (env: Environment) => {
    const { entities } = getPane(env);
    const obj = getDynamicObject(env, defaultObjConfig);
    obj.body.setPosition({ x: 100, y: 200 });
    addDynamicObject(entities, obj);

    const target = getStaticTarget(env, env.app.containers.entity);
    target.position.set({ x: 600, y: 100 });
    obj.startFollowing(target.position.signal);

    const routine = function* () {
      while (true) {
        yield 4;
        obj.isEnabled.set(false);
        yield 4;
        obj.isEnabled.set(true);
        obj.body.setPosition({ x: 100, y: 200 });
        obj.startFollowing(target.position.signal);
        obj.body.graphics().isEnabled.set(true);
      }
    };
    env.routines.connect(routine);
    // I stopped here
  },

  following: (env: Environment) => {
    const pane = getPane(env);

    const target = getTarget(env, 3);

    const obj = getDynamicObject(env, {
      speed: 1.0,
      spriteName: "adopt",
      bodyProps: {
        position: { x: 200, y: 200 },
        shape: { kind: "rect", width: 30, height: 60 },
        body: {
          isStatic: false,
          collisionGroup: collisionGroups.player,
        },
      },
    });
    addDynamicObject(pane.entities, obj);

    target.timer.start();

    obj.sprite().setOnClick(() =>
      console.dir({
        onFollowing: obj.onFollowing.get(),
      }),
    );

    const followingRoutine = function* () {
      while (true) {
        obj.startFollowing(target.shape.position.signal);
        target.shape.position.emit();
        yield 3;
        obj.stopFollowing();
        yield 3;
      }
    };
    env.routines.connect(followingRoutine);
  },
};
