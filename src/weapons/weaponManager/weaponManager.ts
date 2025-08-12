import { Property } from "../../core/property";
import { Environment } from "../../utils/environment";
import { cns } from "../../utils/logger/cns";
import { HolyBible, Lightning, Sword } from "../definitions";
import { getHolyBible } from "../holyBible/holyBible";
import { defaultConfig as defaultSwordConfig } from "../sword/config";
import { getSword } from "../sword/sword";
import { defaultHolyBibleConfig } from "../holyBible/configs";
import { Signal } from "../../core/signal";
import { Vector2 } from "@dimforge/rapier2d-compat";
import { getLightning } from "../lightning/lightning";
import { defaultLightningConfig } from "../lightning/configs";
import { getChoosePanel, Option } from "../ui/choosing";
import { EnemyManager } from "../../gameobjects/enemy/enemyManager";

export type Weapon = Sword | HolyBible | Lightning;

export type WeaponManager = ReturnType<typeof getWeaponManager>;

export function getWeaponManager(
  env: Environment,
  posSignal: Signal<Vector2>,
  dirSignal: Signal<Vector2>,
  em: EnemyManager,
) {
  const logger = cns.getInstance("weaponManager");

  const isEnabled = new Property(false, (a, b) => a === b);
  const map = new Map<Weapon["kind"], Weapon>();

  const added = new Signal<Weapon["kind"]>();
  const upgraded = new Signal<Weapon["kind"]>();

  const addWeapon = (kind: Weapon["kind"]) => {
    logger.debug(() => `addWeapon ${kind}`);
    logger.assert(!map.has(kind), () => `addWeapon: already exists ${kind}`);

    switch (kind) {
      case "sword": {
        const sword: Sword = getSword(
          env,
          defaultSwordConfig,
          posSignal,
          dirSignal,
          em.getEnemyById,
        );
        env.world.collisionManager.weaponHit.connect(sword.handleHit);
        map.set(kind, sword);
        sword.run();
        posSignal.emitLatest();
        break;
      }
      case "holyBible": {
        const holyBible: HolyBible = getHolyBible(
          env,
          defaultHolyBibleConfig,
          posSignal,
          em.getEnemyById,
        );
        env.world.collisionManager.weaponHit.connect(holyBible.handleHit);
        map.set(kind, holyBible);
        holyBible.run();
        posSignal.emitLatest();
        break;
      }
      case "lightning": {
        const lightning: Lightning = getLightning(
          env,
          defaultLightningConfig,
          em,
        );
        map.set(kind, lightning);
        lightning.run();
        break;
      }
    }
    added.emit(kind);
  };

  const upgrade = (kind: Weapon["kind"]) => {
    logger.debug(() => `upgradeWeapon ${kind}`);
    logger.assert(
      map.has(kind),
      () => `upgradeWeapon: weapon absent in the collection`,
    );

    const weapon = map.get(kind)!;
    weapon.stop();
    const upgradedWeapon = weapon.upgraded();
    switch (kind) {
      case "sword":
      case "holyBible": {
        const w = upgradedWeapon as Sword | HolyBible;
        env.world.collisionManager.weaponHit.connect(w.handleHit);
      }
    }
    map.set(kind, upgradedWeapon);
    upgradedWeapon.run();
    upgraded.emit(kind);
  };

  const choosePanel = getChoosePanel<Weapon["kind"]>(env);
  const handleSelection = (kind: Weapon["kind"]) => {
    if (map.has(kind)) upgrade(kind);
    else addWeapon(kind);
    env.app.onPause.set(false);
  };
  choosePanel.choise.connect(handleSelection);

  const showWeaponSelection = () => {
    env.app.togglePause();

    const options: Option<Weapon["kind"]>[] = [
      { title: "sword", content: "next level", arg: "sword" },
      { title: "holyBible", content: "next level", arg: "holyBible" },
      { title: "lightning", content: "next level", arg: "lightning" },
    ];

    choosePanel.showOptions(options);
  };

  return {
    addWeapon,
    upgrade,
    isEnabled,
    kinds: () => map.keys(),

    added,
    upgraded,
    showWeaponSelection,

    weapons: {
      sword: () => map.get("sword") as Sword,
      holyBible: () => map.get("holyBible") as HolyBible,
      lightning: () => map.get("lightning") as Lightning,
    },
  };
}
