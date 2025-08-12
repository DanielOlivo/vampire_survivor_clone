import { describe, test, assert } from "vitest";
import { SetProperty } from "./SetProperty";

describe("SetProperty", () => {
  test("add", async () => {
    const numbers = new SetProperty<number>();

    await new Promise((res) => {
      const n = 1;

      const handler = (x: number) => {
        assert.equal(x, n);
        res(x);
      };
      numbers.added.connect(handler);

      numbers.add(n);
    });
  });

  test("delete", async () => {
    const numbers = new SetProperty<number>([2]);
    await new Promise((res) => {
      const handler = (x: number) => {
        assert.equal(x, 2);
        res(x);
      };
      numbers.deleted.connect(handler);

      numbers.delete(2);
    });
  });

  test("clear", async () => {
    const numbers = [1, 2, 3];
    const set = new SetProperty(numbers);

    await new Promise((res) => {
      const remained = new Set(numbers);

      const handler = (n: number) => {
        remained.delete(n);

        if (remained.size === 0) res(true);
      };
      set.deleted.connect(handler);

      set.clear();
    });
  });

  test("Array.from", () => {
    const numbers = [1, 2, 3];
    const set = new SetProperty(numbers);

    const arr = Array.from(set);
    assert.equal(arr.length, 3);
    assert.equal(arr[0], 1);
    assert.equal(arr[1], 2);
    assert.equal(arr[2], 3);
  });
});
