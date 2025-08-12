import { Property } from "../core/property";
import { Parent } from "../paneDefinitions";

export function addPauseButton(pane: Parent, onPause: Property<boolean>) {
  const button = pane.addButton({
    title: "Pause",
  });
  const handle = (isPaused: boolean) => {
    button.title = isPaused ? "Continue" : "Pause";
  };
  onPause.signal.connect(handle);

  button.on("click", () => onPause.set(!onPause.get()));
}
