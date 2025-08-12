import { describe, test, assert } from "vitest";
import { Map2Property } from "./Map2Property";

describe("Map2Property", () => {
  const key1 = 1;
  const key2 = "key";
  const value = 2;

  test("set: add", async () => {
    const map = new Map2Property<number, string, number>();

    await new Promise((res) => {
      const handle = ([k1, k2, v]: [number, string, number]) => {
        assert.equal(k1, key1);
        assert.equal(k2, key2);
        assert.equal(v, value);
        res(undefined);
      };
      map.added.connect(handle);

      map.set(key1, key2, value);
    });
  });

  test("set: update", async () => {
    const map = new Map2Property<number, string, number>();
    map.set(key1, key2, value);

    await new Promise((res) => {
      const valUpdate = 4;

      const handle = (args: [number, string, number]) => {
        assert.equal(args[2], valUpdate);
        res(undefined);
      };
      map.updated.connect(handle);
      map.set(key1, key2, valUpdate);
    });
  });

  test("delete", async () => {
    const map = new Map2Property<number, string, number>();
    map.set(key1, key2, value);

    await new Promise((res) => {
      const handle = ([k1, k2, v]: [number, string, number]) => {
        assert.equal(k1, key1);
        assert.equal(k2, key2);
        assert.equal(v, value);
        res(undefined);
      };
      map.deleted.connect(handle);
      map.delete(key1, key2);
    });
  });
});
