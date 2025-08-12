import { getCamera } from "./camera/camera";
import { Signal } from "./core/signal";
import { getCollectableManager } from "./gameobjects/collectables/collectableManager";
import { defaultEnemyConfigs } from "./gameobjects/enemy/defaultEnemyTypes";
import { defaultSchedule } from "./gameobjects/enemy/defaultSchedule";
import { getEnemyManager } from "./gameobjects/enemy/enemyManager";
import { getLocation } from "./gameobjects/location/location";
import { simpleConfig as simpleLocationConfig } from "./gameobjects/location/locationConfigs";
import { getLevelController } from "./gameobjects/player/leveling/leveling";
import { defaultPlayerConfig, getPlayer } from "./gameobjects/player/player";
import { getProgressBar } from "./gameobjects/progressBar/progressBar";
import { getGameOverScreen } from "./ui/gameOverScreen/gameOverScreen";
import { getPaneContainer } from "./ui/paneContainer";
import { addPauseButton } from "./ui/pause.pane";
import { Scene } from "./ui/sceneType";
import { Environment } from "./utils/environment";
import { cns, Level } from "./utils/logger/cns";
import { getWeaponManager } from "./weapons/weaponManager/weaponManager";

export const defaultScene: Scene = (env: Environment) => {
  const isOver = new Signal<void>();

  const pane = getPaneContainer("default scene");
  addPauseButton(pane.pane, env.app.onPause);

  cns.setLevel(Level.Trace);
  cns.setCategories(
    // 'collectableManager',
    // 'collisionManager',
    // 'expItem',
    "weaponManager",
    "holyBible",
    "player",
  );

  // setting up location
  getLocation(env, simpleLocationConfig);

  // setting up player
  const player = getPlayer(env, defaultPlayerConfig);
  env.controls.startListening();
  env.controls.direction.connect(player.obj.dirVelocity.dir.set);

  // setting up camera
  const camera = getCamera(env);
  camera.setAt(player.obj.body.position);

  // level mechanics
  const leveling = getLevelController();
  const levelBar = getProgressBar(env.app.containers.ui, {
    width: 500,
    height: 20,
    initValue: 0,
    frontColor: "aqua",
    backColor: "black",
    alpha: 0.8,
  });
  levelBar.position.set({ x: 400, y: 0 });
  leveling.progressSignal.connect(levelBar.value.set);

  // enemies
  const enemyManager = getEnemyManager(
    env,
    defaultSchedule,
    defaultEnemyConfigs,
    player.obj.body.position,
  );

  // weapons
  const weaponManager = getWeaponManager(
    env,
    player.obj.body.position,
    player.obj.body.linvel,
    enemyManager,
  );
  const collectableManager = getCollectableManager(
    env,
    player.obj.body.position,
  );

  // const choisePanel = getChoosePanel<Weapon['kind']>(env)

  const gameOverScreen = getGameOverScreen(env);

  player.setupCollision(enemyManager.getEnemyById);
  env.world.collisionManager.enemyContact.connect(player.enemyContactHandler());
  enemyManager.deathPosition.connect(collectableManager.handleEnemyDeath);
  env.world.collisionManager.expItemGrab.connect(collectableManager.handleGrab);
  env.world.collisionManager.expItemContact.connect(
    collectableManager.handleAcquirement,
  );

  env.world.collisionManager.expItemContact.connect(leveling.handleAcquirement);
  leveling.progressSignal.connect(levelBar.value.set);

  gameOverScreen.clicked.connect(() => isOver.emit());

  const handlePlayerDeath = (isDead: boolean) => {
    if (!isDead) return;
    for (const enemy of enemyManager.enemies()) enemy.obj.stopFollowing();

    player.obj.stopListenDir();
    const routine = function* () {
      yield 3;
      gameOverScreen.isEnabled.set(true);
    };
    env.routines.connect(routine);
  };
  player.stats.isDead.signal.connect(handlePlayerDeath);

  leveling.level.signal.connect(weaponManager.showWeaponSelection);
  for (let i = 0; i < 9; i++) leveling.handleAcquirement();

  // weaponManager.addWeapon("holyBible");
  weaponManager.addWeapon("lightning");

  const spawnEnemiesRoutine = function* () {
    while (!player.stats.isDead.get()) {
      enemyManager.createEnemy("medium");
      yield 0.5;
    }
  };
  env.routines.connect(spawnEnemiesRoutine);

  return {
    pane: undefined,
    usesWorld: true,
    isOver,
  };
};
