import { getPaneContainer } from "../../ui/paneContainer";

import { addPauseButton } from "../../ui/pause.pane";

import { Scenes } from "../../ui/sceneType";

import { Environment } from "../../utils/environment";

import { cns, Level } from "../../utils/logger/cns";

import { getRandomPositionAtDonut } from "../../utils/randomPositionAtDonut";

import { defaultPlayerConfig, getPlayer } from "../player/player";

import { getCollectableManager } from "./collectableManager";

export default {
  "collectables: picking up": (env: Environment) => {
    cns.setLevel(Level.Debug);

    const pane = getPaneContainer("picking up");
    addPauseButton(pane.pane, env.app.onPause);

    const player = getPlayer(env, defaultPlayerConfig);
    const position = { x: 400, y: 200 };
    player.obj.body.setPosition(position);
    env.controls.startListening();
    env.controls.direction.connect(player.obj.dirVelocity.dir.set);

    const manager = getCollectableManager(env, player.obj.body.position);
    env.world.collisionManager.expItemGrab.connect(manager.handleGrab);
    env.world.collisionManager.expItemContact.connect(
      manager.handleAcquirement,
    );

    manager.handleEnemyDeath({ x: 200, y: 200 });

    return {
      pane,

      usesWorld: true,
    };
  },

  "collectables: picking multiple": (env: Environment) => {
    const pane = getPaneContainer("collectables");

    cns.setCategories(
      "expItem",
      "collectableManager",
      "collisionManager",
      "do",
    );

    cns.setLevel(Level.Trace);

    const player = getPlayer(env, defaultPlayerConfig);
    env.controls.startListening();
    env.controls.direction.connect(player.obj.dirVelocity.dir.set);
    const position = { x: 400, y: 400 };
    player.obj.body.setPosition(position);

    const manager = getCollectableManager(env, player.obj.body.position);

    env.world.collisionManager.expItemGrab.connect(manager.handleGrab);

    env.world.collisionManager.expItemContact.connect(
      manager.handleAcquirement,
    );

    const spawn = function* () {
      while (true) {
        manager.handleEnemyDeath(getRandomPositionAtDonut(position, 200, 300));
        yield 1;
      }
    };

    env.routines.connect(spawn);

    return {
      pane,

      usesWorld: true,
    };
  },
} satisfies Scenes;
