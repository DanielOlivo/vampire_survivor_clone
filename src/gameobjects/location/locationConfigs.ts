import { LocationConfig } from "./location";

export const simpleConfig: LocationConfig = {
  // I stopped here
  water: [
    { x: -50, y: -50, width: 100, height: 20, isSolid: true },
    { x: -50, y: 30, width: 100, height: 20, isSolid: true },

    { x: -50, y: -30, width: 20, height: 80, isSolid: true },
    { x: 30, y: -30, width: 20, height: 80, isSolid: true },
  ],
  grass: [{ x: -30, y: -30, width: 60, height: 60, isSolid: false }],
  initOffset: { x: 0, y: 0 },
};
