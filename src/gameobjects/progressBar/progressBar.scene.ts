// import { SceneMaker } from "../definitions";
// import { configs } from "./configs";
// import { getProgressBar } from "./progressBar";

// export const progressBarScene: SceneMaker = ({ uiEnvironment }) => {
//   const bar = getProgressBar(uiEnvironment, configs.level);
//   bar.setEnable(true);

//   const handleTimer = (t: number) => bar.value.set(t);

//   const timer = uiEnvironment.timers.getContinuousTimer(handleTimer, 5);
//   timer.start();
// };
