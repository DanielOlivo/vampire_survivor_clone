import { defaultConfig } from "./config";
import { getSword, getSwordSwing } from "./sword";
import { Environment } from "../../utils/environment";
import { getEnemyManager } from "../../gameobjects/enemy/enemyManager";
import { defaultSchedule } from "../../gameobjects/enemy/defaultSchedule";
import { defaultEnemyConfigs } from "../../gameobjects/enemy/defaultEnemyTypes";
import { getStaticTarget } from "../../utils/target/staticTarget";
import { Property } from "../../core/property";
import { getPane } from "../../ui/paneTest";
import { addSwordPane } from "./sword.pane";
import { cns, Level } from "../../utils/logger/cns";
import { getPlayer } from "../../gameobjects/player/player";

export default {
  swordMovesWithCharacters: (env: Environment) => {
    cns.setCategories("collisionManager", "sword");
    cns.setLevel(Level.Trace);

    const { entities } = getPane(env);

    const playerConfig = {
      grabRadius: 20,
      hitRadius: 10,
      speed: 3.0,
    };

    const player = getPlayer(env, playerConfig);
    player.obj.body.setPosition({ x: 300, y: 300 });
    env.controls.startListening();
    env.controls.direction.connect(player.obj.dirVelocity.dir.set);

    const sword = getSword(
      env,
      defaultConfig,
      player.obj.body.position,
      player.obj.dirVelocity.dir.signal,
    );
    player.obj.body.position.connect(sword.position.set);
    player.obj.dirVelocity.linvel.signal.connect(sword.direction.set);
    // sword.startRoutine();
    sword.run();

    addSwordPane(entities, sword);

    // enable enemy
    const enemyManager = getEnemyManager(
      env,
      defaultSchedule,
      defaultEnemyConfigs,
      player.obj.body.position,
    );
    // sword.setupCollision(() => defaultConfig, enemyManager.getEnemyById);
    // env.world.collisionManager.weaponHit.connect(sword.getHitHandler());

    // sword.setupCollision(() => defaultConfig, enemyManager.getEnemyById);
    // env.world.collisionManager.weaponHit.connect(sword.getHitHandler);

    const enemy = enemyManager.createEnemy("medium", { x: 500, y: 200 });
    enemy.obj.stopFollowing();
    // addEnemy(entities, enemy);
    // let delay = 0

    const createEnemey = function* () {
      yield 5;
      enemyManager.createEnemy("medium", { x: 500, y: 200 });
      enemy.obj.stopFollowing();

      // const handleDeath = () => {
      //     enemy?.isDead.disconnect(handleDeath)
      //     enemy = undefined
      //     delay = 7
      //     env.routines.connect(createEnemey)
      // }
      // enemy.isDead.connect(handleDeath)
    };
    const runRoutine = () => env.routines.connect(createEnemey);

    enemy.isDead.connect((isDead) => {
      if (isDead) runRoutine();
    });

    // env.routines.connect(createEnemey)
  },

  swingRoutine: (env: Environment) => {
    const swing = getSwordSwing(env, defaultConfig, true);
    swing.position.set({ x: 200, y: 200 });

    const periodicCaller = function* () {
      while (true) {
        swing.makeSwing();
        yield 4;
      }
    };

    env.routines.connect(periodicCaller);
  },

  swordRoutine: (env: Environment) => {
    const position = new Property({ x: 200, y: 200 });
    const direction = new Property({ x: 1, y: 0 });

    const sword = getSword(
      env,
      {
        ...defaultConfig,
        isDouble: true,
        secondStartDelay: 0.3,
      },
      position.signal,
      direction.signal,
    );
    sword.position.set({ x: 200, y: 200 });

    // sword.startRoutine();
    sword.run();
  },

  bodyAndSensor: (env: Environment) => {
    // const body = getBody(env, {
    //     shape: {kind: 'rect', width: 200, height: 200},
    //     position: {x: 100, y: 100},
    //     body: {
    //         isStatic: false,
    //         collisionGroup: collisionGroups.enemy
    //     }
    // })
    // body.graphics().setEnabled(true)

    // const sensor = getSensor(env, {
    //     shape: {kind: 'rect', width: 100, height: 100},
    //     collisionGroup: collisionGroups.weapon
    // })
    // sensor.position.position.set({x: 400, y: 50})
    // sensor.graphics().setEnabled(true)
    const swing = getSwordSwing(env, defaultConfig, true);
    swing.position.set({ x: 300, y: 50 });
    function* runSwing() {
      while (true) {
        swing.makeSwing();
        yield 3;
      }
    }
    env.routines.connect(runSwing);

    const target = new Property({ x: 340, y: 50 });

    const enemyManager = getEnemyManager(
      env,
      defaultSchedule,
      defaultEnemyConfigs,
      target.signal,
    );
    const enemy = enemyManager.createEnemy("medium", { x: 400, y: 50 });
    env.world.collisionManager.enemyHandles.add(enemy.obj.getId());
    // env.world.collisionManager.weaponHandles.add(sensor.getId())

    target.emit();
    // const handleBodyPosition = (p: number) => enemy.obj.body.setPosition({x: 200 + p * 300, y: 100})
    // env.app.timers.getContinuousTimer(handleBodyPosition, 4).start()
  },

  swordHitsEnemies: (env: Environment) => {
    cns.setCategories("collisionManager");
    cns.setLevel(Level.Trace);

    const target = getStaticTarget(env);
    target.position.set({ x: 230, y: 200 });
    target.startEmitting();

    const direction = new Property({ x: 1, y: 0 });

    const sword = getSword(
      env,
      defaultConfig,
      target.position.signal,
      direction.signal,
    );
    sword.position.set({ x: 200, y: 200 });
    sword.run();

    const enemyManager = getEnemyManager(
      env,
      defaultSchedule,
      defaultEnemyConfigs,
      target.position.signal,
    );
    enemyManager.enemySpawned.connect((enemy) =>
      env.world.collisionManager.enemyHandles.add(enemy.obj.getId()),
    );

    const enemySpawning = function* () {
      while (true) {
        enemyManager.createEnemy("medium", { x: 500, y: 200 });
        // enemy.obj.body.graphics().setEnabled(true)
        yield 10;
      }
    };
    env.routines.connect(enemySpawning);
  },

  // swordScene: (env: Environment) => {
  //     const panel = getDebugPanel(env.app)
  //     env.app.containers.ui.addChild(panel.container)

  //     const sword = getSword(env, {...defaultConfig, isDouble: true, secondStartDelay: 0.3})
  //     sword.position.set({x: 200, y: 200})
  //     sword.start()
  // },
};
