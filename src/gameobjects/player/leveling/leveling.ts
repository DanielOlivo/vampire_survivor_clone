import { Property } from "../../../core/property";
import { Signal } from "../../../core/signal";

export type LevelController = ReturnType<typeof getLevelController>;

export function getLevelController() {
  const level = new Property(1);
  const xpRequired = new Property(10);
  const collected = new Property(0);

  /** connect to the ui handler */
  const progressSignal = new Signal<number>();
  const levelUp = new Signal<number>();

  const handleAcquirement = (): void => {
    const upd = collected.get() + 1;
    if (upd >= xpRequired.get()) {
      collected.set(0);
      xpRequired.set(xpRequired.get() * 2);
      level.set(level.get() + 1);
      levelUp.emit(level.get());

      progressSignal.emit(0);
      return;
    }
    collected.set(upd);
    const progress = collected.get() / xpRequired.get();
    progressSignal.emit(progress);
  };

  const reset = (): void => {
    level.set(1);
    xpRequired.set(10);
    collected.set(0);
  };

  return {
    level,

    handleAcquirement,
    reset,

    xpRequired,
    collected,

    /**connect to the ui handler */
    progressSignal,
  };
}
