import rogue1 from "./00/Dark Elf/rogue.png";
import rogue2 from "./00/Dark Elf/rogue + female.png";

import rebel from "./00/Dark Elf/rebel.png";

import runaway from "./00/Dark Elf/runaway.png";

import medium1 from "./00/Dark Elf/Medium.png";
import medium2 from "./00/Dark Elf/Medium + female.png";

import bulglar1 from "./00/Dark Elf/burglar.png";
import bulglar2 from "./00/Dark Elf/burglar + female.png";

import adopt from "./00/Dark Elf/adopt.png";

import shard1 from "./shard_01c.png";

import sword1 from "./sword1.svg";
import sword2 from "./sword2.svg";
import sword3 from "./sword3.svg";
import swordMask from "./swordMask.svg";

import grass0 from "./topdown_tiles/tiles/grass0/straight/0/0.png";
import grass1 from "./topdown_tiles/tiles/grass1/straight/0/0.png";
import grass2 from "./topdown_tiles/tiles/grass2/straight/0/0.png";
import grass3 from "./topdown_tiles/tiles/grass3/straight/0/0.png";
import grass4 from "./topdown_tiles/tiles/grass4/straight/0/0.png";
import grass5 from "./topdown_tiles/tiles/grass5/straight/0/0.png";

import water0 from "./topdown_tiles/tiles/deep0/straight/0/0.png";
import water1 from "./topdown_tiles/tiles/deep0/straight/90/0.png";
import water2 from "./topdown_tiles/tiles/deep0/straight/180/0.png";
import water3 from "./topdown_tiles/tiles/deep0/straight/270/0.png";

import holyBible from "./weapon/holyBible.png";

import startBackground from "./startScreenBackground.png";

export const characters = {
  rogue1,
  rogue2,
  rebel,
  runaway,
  medium1,
  medium2,
  bulglar1,
  bulglar2,
  adopt,
};

export const items = {
  shard1,
};

export const sword = {
  sword1,
  sword2,
  sword3,
  swordMask,
};

export const weapon = {
  holyBible,
};

export const grass = {
  grass0,
  grass1,
  grass2,
  grass3,
  grass4,
  grass5,
};

export const water = {
  water0,
  water1,
  water2,
  water3,
};

export const uiSprites = {
  startBackground,
};

const grassArray = Array.from(Object.keys(grass));
const waterArray = Array.from(Object.keys(water));
const getRandom = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export const getRandomGrassSprieName = () => getRandom(grassArray);
export const getRandomWaterSpriteName = () => getRandom(waterArray);
