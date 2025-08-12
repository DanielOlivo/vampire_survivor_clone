import { LightningConfig } from "./lightning";

export const defaultLightningConfig: LightningConfig = {
  count: 3,
  // count: 8,
  attack: 40,
  duration: 0.2,
  recharge: 4,
  // recharge: 1,
};

export function upgradeLightning(config: LightningConfig): LightningConfig {
  return {
    count: Math.min(8, config.count + 1),
    attack: config.attack * 1.1,
    duration: config.duration,
    recharge: Math.max(2, config.recharge * 0.9),
  };
}
