import { HolyBibleConfig } from "./holyBible";

export const defaultHolyBibleConfig: HolyBibleConfig = {
  angularSpeed: 1.0,
  radius: 60,
  size: 30,
  duration: 4,
  recharge: 3,

  count: 3,
  attack: 20,
};

export function upgradeConfig(config: HolyBibleConfig): HolyBibleConfig {
  return {
    angularSpeed: Math.min(config.angularSpeed * 1.1, 2),
    radius: Math.min(config.radius * 1.15, 100),
    size: Math.min(config.size * 1.1, 60),
    duration: Math.min(config.duration * 1.1, 8),
    recharge: config.recharge * 0.95,

    count: Math.min(8, config.count + 1),
    attack: config.attack * 1.1,
  };
}
