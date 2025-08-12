import { EnemyConfig } from "./enemy";

export { type EnemyConfig } from "./enemy";

export type EnemyConfigs = { [P: string]: EnemyConfig };

export const defaultEnemyConfigs: EnemyConfigs = {
  rogue: {
    speed: 1.0,
    spriteName: "rogue2",
    type: "rogue",
    attack: 2,
    attackInterval: 1.0,
    shield: 1.0,
    health: 60,
  },

  medium: {
    speed: 1.0,
    spriteName: "medium2",
    type: "medium",
    attack: 2,
    attackInterval: 1.0,
    shield: 1.0,
    health: 60,
  },
};
