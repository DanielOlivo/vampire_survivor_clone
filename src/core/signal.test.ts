import { describe, test, assert } from "vitest";
import { Signal } from "./signal";

describe("core components test", () => {
  test("signal", async () => {
    const signal = new Signal<boolean>();

    const timeout = setTimeout(() => {
      throw new Error("fail");
    }, 200);

    const handler = (en: boolean) => {
      assert.isTrue(en);
      clearTimeout(timeout);
    };
    signal.connect(handler);
    signal.emit(true);
  });

  test("storing to set", () => {
    const fn = (x: number) => x * 2;
    const fn2 = fn;
    type Fn = typeof fn;

    const set = new Set<Fn>();

    assert.equal(set.size, 0);

    set.add(fn);
    assert.equal(set.size, 1);

    set.add(fn);
    assert.equal(set.size, 1);

    set.add(fn2);
    assert.equal(set.size, 1);
  });
});
