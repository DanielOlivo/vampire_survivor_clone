import { Signal } from "../core/signal";
import { Environment } from "../utils/environment";
import { PaneContainer } from "./paneContainer";

export type Scene = (env: Environment) => {
  usesWorld: boolean;
  pane: PaneContainer | undefined;
  isOver?: Signal<void>;
};

export type Scenes = { [P: string]: Scene };
