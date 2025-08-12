import { Button } from "@pixi/ui";
import { Application, Container, Graphics, Renderer, Text } from "pixi.js";

export type ButtonCOnfig = {
  width?: number;
  height?: number;
  radius?: number;
  color?: number;
  text?: string;

  onPress: () => void;
};

export class TextButton {
  private _view: Container;
  private _btn: Button;

  get button() {
    return this._btn;
  }
  get view() {
    return this._view;
  }

  constructor(config: ButtonCOnfig) {
    const {
      width = 200,
      height = 30,
      radius = 0,
      text = "Button",
      onPress,
      color = 0xffffff,
    } = config;

    this._view = new Container();
    const buttonBg = new Graphics()
      .roundRect(0, 0, width, height, radius)
      .fill(color);
    const _text = new Text({ text });

    _text.anchor.set(0.5);
    _text.x = buttonBg.width / 2;
    _text.y = buttonBg.height / 2;

    this.view.addChild(buttonBg, _text);

    this._btn = new Button(this._view);

    this._btn.onPress.connect(onPress);
  }

  addToScene = (app: Application<Renderer>) => app.stage.addChild(this._view);
  removeFromScene = (app: Application<Renderer>) =>
    app.stage.removeChild(this._view);
}
