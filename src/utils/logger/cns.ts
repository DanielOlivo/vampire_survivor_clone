export enum Level {
  Trace = 0,
  Debug = 1,
  Info = 2,
  Warning = 3,
  Error = 4,
  Fatal = 5,
}

const colors = [
  "aqua",
  "blueviolet",
  "coral",
  "crimson",
  "deepskyblue",
  "aliceblue",
  "gold",
];

function getLogger() {
  const enabledCategories = new Set<string>();
  let currentLevel: Level = Level.Info;
  const catColors = new Map<string, string>();

  const setCategories = (...cats: string[]) => {
    enabledCategories.clear();
    cats.forEach((c) => enabledCategories.add(c));

    catColors.clear();
    cats.forEach((val, idx) => catColors.set(val, colors[idx]));
  };
  setCategories(
    "player",
    "enemy",
    "collisionManager",
    "enemyManager",
    "collectableManager",
  );

  const setLevel = (level: Level) => {
    currentLevel = level;
  };

  const getInstance = (category: string) => {
    const isEnabled = (level: Level) =>
      enabledCategories.has(category) && level >= currentLevel;

    let context = "";
    const setContext = (ctx: string): void => {
      context = ctx;
    };

    let preferTable = false;
    const setTableAsPreferred = (en: boolean) => {
      preferTable = en;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const print = (printFn: (...arg: any[]) => void, msg: string | object) => {
      if (typeof msg === "string") {
        printFn(
          `%c${category} %c(${context})%c: ${msg}`,
          `color:${catColors.get(category)}`,
          `color:red`,
          "color:white",
        );
        return;
      }

      if (preferTable) {
        const values = Object.values(msg);
        if (values.every((v) => typeof v !== "object")) {
          printFn(msg);
          return;
        }
      }

      printFn(msg);
    };

    const trace = (messageFn: () => string | object) => {
      if (!isEnabled(Level.Trace)) return;
      print(console.log, messageFn());
    };

    const debug = (messageFn: () => string | object) => {
      if (!isEnabled(Level.Debug)) return;
      print(console.log, messageFn());
    };
    const info = (messageFn: () => string | object) => {
      if (!isEnabled(Level.Info)) return;
      print(console.log, messageFn());
    };
    const warning = (messageFn: () => string | object) => {
      if (!isEnabled(Level.Warning)) return;
      print(console.warn, messageFn());
    };

    const error = (errorFn: () => string) => {
      if (!isEnabled(Level.Error)) return;
      print(console.error, errorFn());
    };

    const fatal = (errorFn: () => string) => {
      if (!isEnabled(Level.Fatal)) return;
      print(console.error, errorFn());
    };

    const assert = (cond: boolean, errorMessageFn: () => string) => {
      if (!isEnabled(Level.Error)) return;
      if (!cond) console.error(errorMessageFn());
    };

    return {
      category,
      setContext,
      setTableAsPreferred,

      trace,
      debug,
      info,
      warning,
      error,
      fatal,
      assert,
    };
  };

  return {
    setCategories,
    setLevel,
    getInstance,
  };
}

/** means console */
export const cns = getLogger();
