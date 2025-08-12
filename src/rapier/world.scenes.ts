import { Vector2 } from "@dimforge/rapier2d-compat";
import { CollisionGroup, collisionGroups } from "./collisionGroups";
import { Environment } from "../utils/environment";
import { V2 } from "../utils/v2";
import { getBody, Props } from "./body/body";
import {
  DynamicObjectConfig,
  getDynamicObject,
} from "./dynamicObject/dynamicObject";
import { Signal } from "../core/signal";

export default {
  staticCircleBody: (env: Environment) => {
    const body = getBody(
      env,
      {
        position: { x: 200, y: 200 },
        shape: { kind: "circle", radius: 50 },
        body: {
          isStatic: true,
          collisionGroup: collisionGroups.wall,
        },
      },
      env.app.containers.entity,
    );
    body.graphics().isEnabled.set(true);
  },

  staticRectBody: (env: Environment) => {
    const body = getBody(
      env,
      {
        position: { x: 300, y: 200 },
        shape: { kind: "rect", width: 400, height: 100 },
        body: {
          isStatic: true,
          collisionGroup: collisionGroups.wall,
        },
      },
      env.app.containers.entity,
    );
    body.graphics().isEnabled.set(true);
  },

  linvel: (env: Environment) => {
    const wallConfigs: Omit<Props, "body">[] = [
      {
        position: { x: 350, y: 50 },
        shape: { width: 500, height: 50, kind: "rect" },
      },
      {
        position: { x: 600, y: 300 },
        shape: { width: 50, height: 500, kind: "rect" },
      },
      {
        position: { x: 350, y: 550 },
        shape: { width: 500, height: 50, kind: "rect" },
      },
      {
        position: { x: 100, y: 300 },
        shape: { width: 50, height: 500, kind: "rect" },
      },
    ];

    for (const conf of wallConfigs) {
      const wall = getBody(
        env,
        {
          ...conf,
          body: {
            isStatic: true,
            collisionGroup: (CollisionGroup.Wall << 16) | CollisionGroup.Enemy,
          },
        },
        env.app.containers.entity,
      );
      wall.graphics().isEnabled.set(true);
    }

    const nonStaticCollisionGroup =
      (CollisionGroup.Enemy << 16) |
      (CollisionGroup.Enemy | CollisionGroup.Wall);

    const ball = getBody(
      env,
      {
        position: { x: 200, y: 200 },
        shape: { kind: "circle", radius: 40 },
        body: {
          isStatic: false,
          collisionGroup: nonStaticCollisionGroup,
        },
      },
      env.app.containers.entity,
    );
    ball.graphics().isEnabled.set(true);

    const rect = getBody(
      env,
      {
        position: { x: 400, y: 400 },
        shape: { kind: "rect", width: 40, height: 20 },
        body: {
          isStatic: false,
          collisionGroup: nonStaticCollisionGroup,
        },
      },
      env.app.containers.entity,
    );
    rect.graphics().isEnabled.set(true);

    let direction: Vector2 = V2.randomNormalized();
    const changeDirection = () => {
      direction = V2.randomNormalized();
      ball.setLinvel(direction);
      rect.setLinvel(direction);
      // console.log('change', direction)
    };
    changeDirection();

    const timer = env.app.timers.getPeriodicTimer(changeDirection, 5);
    timer.start();
  },

  dynamicObjectTraces: (env: Environment) => {
    const props: DynamicObjectConfig = {
      bodyProps: {
        position: { x: 400, y: 300 },
        shape: { kind: "rect", width: 30, height: 60 },
        body: {
          isStatic: false,
          collisionGroup: collisionGroups.player,
        },
      },
      speed: 1.0,
      spriteName: "adopt",
    };

    const obj = getDynamicObject(env, props);

    const positions = [
      { x: 300, y: 100 },
      { x: 100, y: 400 },
      { x: 500, y: 400 },
    ];
    let idx = 0;

    const posSignal = new Signal<Vector2>();

    const changePosition = () => {
      idx = (idx + 1) % positions.length;
      posSignal.emit(positions[idx]);
    };

    obj.startFollowing(posSignal);
    changePosition();

    const timer = env.app.timers.getPeriodicTimer(changePosition, 5);
    timer.start();
  },

  // sensorTest: (env: Environment) => {
  //     const sensor = getSensor(env, {
  //         collisionGroup: collisionGroups.grabSensor,
  //         shape: {kind: 'circle', radius: 40}
  //     }, env.app.containers.entity)

  //     sensor.graphics().setEnabled(true)

  //     const body = getBody(env, {
  //         shape: {kind: 'circle', radius: 20},
  //         position: {x: 400, y: 200},
  //         body: {
  //             isStatic: false,
  //             collisionGroup: collisionGroups.expItem
  //         }
  //     }, env.app.containers.entity)
  //     body.graphics().setEnabled(true)

  //     const translate = (t: number) => sensor.position.set({x: 200 + t * 200, y: 200})

  //     env.world.collision.connect(() => console.log('collision'))

  //     const timer = env.app.timers.getContinuousTimer(
  //         translate,
  //         5
  //     )
  //     timer.start()
  // }
};
