import { Vector2 } from "@dimforge/rapier2d-compat";
import { Stats } from "../core/stats/characterStats";
import { Property } from "../core/property";
import { Signal } from "../core/signal";
import { WeaponHitEvent } from "../rapier/collisionManager/collisionManager";

export type CollisionHandler = (
  handlle1: number,
  handle2: number,
  started: boolean,
) => void;

export type WeaponHitHandler = (enemyStats: Stats, started: boolean) => void;

interface Weapon {
  run: () => void;
  stop: () => void;

  isOn: {
    signal: Signal<boolean>;
    get: () => boolean;
  };
}

export interface Sword extends Weapon {
  kind: "sword";

  position: Property<Vector2>;
  direction: Property<Vector2>;

  handleHit: (ev: WeaponHitEvent) => void;

  upgraded: () => Sword;
}

export interface HolyBible extends Weapon {
  kind: "holyBible";

  position: Property<Vector2>;

  handleHit: (ev: WeaponHitEvent) => void;

  upgraded: () => HolyBible;
}

export interface Lightning extends Weapon {
  kind: "lightning";

  upgraded: () => Lightning;
}
