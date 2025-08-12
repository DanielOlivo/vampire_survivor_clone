import { Container, Graphics } from "pixi.js";
import { Vector2 } from "@dimforge/rapier2d-compat";
import { Property } from "../../core/property";

export type ShapeType = "rect" | "circle" | "donut";

// Defining main shapes

export type Circle = {
  kind: "circle";
  radius: number;
};

export type Rect = {
  kind: "rect";
  width: number;
  height: number;
};

export type Donut = {
  kind: "donut";
  innerRadius: number;
  outerRadius: number;
};

export type ShapeProps = Circle | Rect | Donut;

export type Shape = {
  position: Property<Vector2>;
  bias: Property<Vector2>;

  /** handle properties update; Doesn't support shape type change */
  handleShape: (props: ShapeProps) => void;

  isEnabled: Property<boolean>;
  // setEnabled: (en: boolean) => void
  // isEnabled: () => boolean

  graphics: Graphics;
};

/** handles position for circle and donut */
function handleCirclePosition(graphics: Graphics, pos: Vector2, bias: Vector2) {
  graphics.position.set(pos.x + bias.x, pos.y + bias.y);
}

/** handles position for rect */
function handleRectPosition(
  graphics: Graphics,
  rect: Rect,
  pos: Vector2,
  bias: Vector2,
) {
  const { width, height } = rect;
  const { x, y } = pos;
  const { x: bx, y: by } = bias;
  graphics.position.set(x + bx - width / 2, y + by - height / 2);
}

type Color = { color: string | number; alpha: number };
const defaultColor = { color: "yellow", alpha: 0.5 };

/**
 * Returns graphics
 * DISABLED by default
 */
export function getShape(
  container: Container,
  shape: ShapeProps,
  color: Color = defaultColor,
): Shape {
  const position = new Property({ x: 0, y: 0 });
  const bias = new Property({ x: 0, y: 0 });

  const graphics = new Graphics();
  graphics.eventMode = "static";

  const handlePosition = (() => {
    switch (shape.kind) {
      case "circle":
      case "donut":
        return (p: Vector2) => handleCirclePosition(graphics, p, bias.get());
      case "rect":
        return (p: Vector2) =>
          handleRectPosition(graphics, shape, p, bias.get());
    }
  })();

  const handleBias = (() => {
    switch (shape.kind) {
      case "circle":
      case "donut":
        return (b: Vector2) =>
          handleCirclePosition(graphics, position.get(), b);
      case "rect":
        return (b: Vector2) =>
          handleRectPosition(graphics, shape, position.get(), b);
    }
  })();

  const handleShape = (() => (shape: ShapeProps) => {
    graphics.clear();

    switch (shape.kind) {
      case "circle":
        graphics.circle(0, 0, shape.radius).fill(color);
        break;
      case "donut":
        graphics
          .circle(0, 0, shape.outerRadius)
          .fill(color)
          .circle(0, 0, shape.innerRadius)
          .cut();
        break;
      case "rect":
        graphics.rect(0, 0, shape.width, shape.height).fill(color);
        break;
    }
  })();

  handleShape(shape);

  const isEnabled = new Property(false, (a, b) => a === b);

  const handleEnable = (en: boolean) => {
    position.signal.setConnection(en, handlePosition);
    bias.signal.setConnection(en, handleBias);

    position.emit();
    bias.emit();

    if (en) container.addChild(graphics);
    else container.removeChild(graphics);
  };
  isEnabled.signal.connect(handleEnable);

  return {
    position,
    bias,
    handleShape,
    isEnabled,

    graphics,
  };
}
