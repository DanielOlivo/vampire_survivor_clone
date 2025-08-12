import { describe, test, assert } from "vitest";
import { CharacterConfig, getCharacterStats } from "./characterStats";

const config: CharacterConfig = {
  id: 1,
  health: 100,
  attack: 10,
  attackInterval: 1,
  shield: 1,
};

describe("stats", () => {
  test("handleDamage", async () => {
    const stats = getCharacterStats(config);

    await new Promise((res, rej) => {
      const timeout = setTimeout(() => {
        rej();
        throw new Error("fail");
      }, 200);

      const handleDamage = () => {
        assert.isOk(true);
        clearTimeout(timeout);
        res(true);
      };
      stats.damaged.connect(handleDamage);

      stats.handleDamage(10);
    });
  });

  test("handle death", async () => {
    const stats = getCharacterStats(config);

    await new Promise((res, rej) => {
      const timeout = setTimeout(() => {
        rej();
      }, 200);

      const handleDeath = () => {
        assert.isOk(true);
        clearTimeout(timeout);
        res(true);
      };
      stats.isDead.signal.connect(handleDeath);

      for (let i = 0; i < 10; i++) stats.handleDamage(10);
    });
  });
});
