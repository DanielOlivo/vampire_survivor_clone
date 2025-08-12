import { ProgressBarConfig } from "./progressBar";

type Configs = { [P: string]: ProgressBarConfig };

export const configs: Configs = {
  level: {
    width: 400,
    height: 20,
    initValue: 0,
    frontColor: "aqua",
    backColor: "black",
    alpha: 0.8,
  },
};
