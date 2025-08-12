import { Parent } from "../../paneDefinitions";
import {
  CollisionManager,
  // EnemyContactEvent,
  // WeaponHitEvent,
} from "./collisionManager";

export function addCollisionManagerPane(
  pane: Parent,
  manager: CollisionManager,
  bufferSize: number = 5,
) {
  const folder = pane.addFolder({
    title: `collision manager`,
  });

  const params = {
    enemyHandles: "",
    enemyHandlesCount: 0,
    expItems: "",
    weaponHandlesCount: 0,
    event: "",
  };

  const handleEnemies = () => {
    params.enemyHandles = Array.from(manager.enemyHandles).join(" ");
    params.enemyHandlesCount = manager.enemyHandles.size;
  };
  manager.enemyHandles.added.connect(handleEnemies);
  manager.enemyHandles.deleted.connect(handleEnemies);

  const handleExpItems = () => {
    params.expItems = Array.from(manager.expItemHandles).join(" ");
  };
  manager.expItemHandles.added.connect(handleExpItems);
  manager.expItemHandles.deleted.connect(handleExpItems);

  const handleWeaponHandles = () => {
    params.weaponHandlesCount = manager.weaponHandles.size;
  };
  manager.weaponHandles.added.connect(handleWeaponHandles);
  manager.weaponHandles.deleted.connect(handleWeaponHandles);

  folder.addBinding(params, "enemyHandles", { readonly: true });
  folder.addBinding(params, "enemyHandlesCount", { readonly: true });
  folder.addBinding(params, "expItems", { readonly: true });
  folder.addBinding(params, "weaponHandlesCount", { readonly: true });
  // folder.addBinding(params, 'event', {readonly: true, bufferSize})
  folder.addBinding(params, "event", {
    readonly: true,
    multiline: true,
    rows: bufferSize,
  });

  // let count = 0;

  // const events: string[] = [];

  // const handleWeaponHit = (ev: WeaponHitEvent) => {
  //   const line = `${count}: ${JSON.stringify(ev)}`;
  //   params.event = line + "\n" + params.event;
  //   count += 1;
  // };
  // manager.weaponHit.connect(handleWeaponHit)

  // const handleExpItemContact = (id: number) => {
  //   params.event = `expItemContact ${id}`;
  //   count += 1;
  // };
  // manager.expItemContact.connect(handleExpItemContact)

  // const handleExpItemGrab = (id: number) => {
  //   params.event = `expItemGrab ${id}`;
  //   count += 1;
  // };
  // manager.expItemGrab.connect(handleExpItemGrab)

  // const handleEnemyContact = (ev: EnemyContactEvent) => {
  //   params.event = JSON.stringify(ev);
  //   count += 1;
  // };
  // manager.enemyContact.connect(handleEnemyContact)

  return folder;
}
