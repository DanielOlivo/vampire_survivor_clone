import { SpawnInterval } from "./scheduler";

export type Schedule = SpawnInterval[];

export const defaultSchedule: Schedule = [
  {
    startTime: 0,
    stopTime: 60 * 3,
    name: "medium",
    interval: 2,
  },
  {
    startTime: 60 * 2,
    stopTime: 10 * 60,
    name: "bulglar",
    interval: {
      min: 10,
      max: 20,
    },
  },
];
