import { describe, test, assert } from "vitest";
import { getRoutineManager, someRoutine, TimeGetter } from "./timeRoutine";

describe("routine", () => {
  test("timeRoutine", () => {
    const manager = getRoutineManager();

    // let count = 0;

    const routine1: (tg: TimeGetter) => Generator<number, void, unknown> =
      function* () {
        // count = 1;
        yield 0;
      };

    manager.connect((tg) => routine1(tg));
  });

  test("splice array", () => {
    const array = [1, 2, 3];
    assert.equal(array.length, 3);
    array.splice(0, array.length);
    assert.equal(array.length, 0);
  });

  test("some routine", () => {
    let time = 0;

    const timeGetter = () => time;

    const routine = someRoutine(timeGetter);

    {
      const { done, value } = routine.next();
      assert.isFalse(done);
      assert.isUndefined(value);
    }

    time = 1;
    {
      const { done, value } = routine.next();
      assert.isFalse(done);
      assert.isUndefined(value);
    }

    time = 2;
    {
      const { done, value } = routine.next();
      assert.isFalse(done);
      assert.equal(value, 3);
    }

    time = 3;
    {
      const { done, value } = routine.next();
      assert.isFalse(done);
      assert.isUndefined(value);
    }

    {
      const { done, value } = routine.next();
      assert.isFalse(done);
      assert.isUndefined(value);
    }

    time = -1;
    {
      const { done, value } = routine.next();
      assert.isTrue(done);
      assert.isUndefined(value);
    }
  });
});
