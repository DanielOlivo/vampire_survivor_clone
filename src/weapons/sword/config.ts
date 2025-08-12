import { Rect } from "../../graphics/shape/shape";

export type SwordConfig = {
  kind: "sword";

  level: number;

  duration: number;
  recharge: number;
  attack: number;
  shape: Rect;
  xBias: number;

  isDouble: boolean; // on both sides
  secondStartDelay: number;
};

export const defaultConfig: SwordConfig = {
  kind: "sword",

  level: 1,

  duration: 1,
  recharge: 2,
  attack: 10,
  shape: { kind: "rect", width: 30, height: 60 },
  xBias: 30,

  isDouble: false,
  secondStartDelay: 0,
};

/** to improve weapon */
export function upgradeSwordConfig(config: SwordConfig): SwordConfig {
  const { level } = config;

  if (level >= 10) return config;

  const {
    duration,
    recharge,
    attack,
    shape: { width, height },
    xBias,
    // isDouble,
    // secondStartDelay,
  } = config;

  return {
    kind: "sword",
    level: level + 1,
    duration,
    recharge: recharge * 0.9,
    attack: attack * 0.1,
    xBias: xBias * 0.1,
    shape: { kind: "rect", width: width * 0.1, height: height * 0.1 },
    isDouble: level > 2,
    secondStartDelay: 0.3,
  };
}
