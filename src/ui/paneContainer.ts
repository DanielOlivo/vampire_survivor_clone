import { Pane } from "tweakpane";

export type PaneContainer = ReturnType<typeof getPaneContainer>;

export function getPaneContainer(title: string) {
  const container = document.createElement("div");
  const header = document.createElement("div");
  const body = document.createElement("div");

  const span = document.createElement("span");
  span.textContent = title;
  header.appendChild(span);
  span.style.userSelect = "none";
  span.style.color = "black";

  container.appendChild(header);
  container.appendChild(body);

  let onDrag = false;
  let offsetX = 0;
  let offsetY = 0;

  header.addEventListener("mousedown", (event) => {
    onDrag = true;
    offsetX = event.clientX - container.offsetLeft;
    offsetY = event.clientY - container.offsetTop;
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (event) => {
    if (!onDrag) return;
    container.style.left = String(event.clientX - offsetX) + "px";
    container.style.top = String(event.clientY - offsetY) + "px";
  });

  header.addEventListener("mouseup", () => {
    onDrag = false;
    document.body.style.userSelect = "";
  });

  {
    const style = container.style;
    style.position = "absolute";
    style.top = "20px";
    style.left = "100px";
  }

  {
    const style = header.style;
    style.minHeight = "20px";
    style.height = "20px";
    style.backgroundColor = "orange";
  }

  {
    const style = body.style;
    // style.backgroundColor = "red"
    style.minWidth = "300px";
    style.minHeight = "100px";
  }

  let enabled = false;
  const handleEnabled = (en: boolean) => {
    if (en === enabled) return;

    if (en) {
      document.body.appendChild(container);
    } else {
      document.body.removeChild(container);
    }
    enabled = en;
  };

  const pane = new Pane({ container: body });

  handleEnabled(true);

  return {
    // container,
    handleEnabled,
    pane,
  };
}
