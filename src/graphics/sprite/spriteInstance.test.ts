import { Application, Graphics } from "pixi.js";
import { describe, test, assert, beforeAll } from "vitest";

describe("sprite instance", () => {
  beforeAll(() => {
    // Mock navigator for Node.js environment
    // global.navigator = global.navigator || { userAgent: "node.js" };
    // Mock the renderer for Node.js environment
    // global.HTMLCanvasElement = global.HTMLCanvasElement || class {};
    // global.window = global.window || {};
  });

  test("checking if it works with graphics", () => {
    const graphics = new Graphics().rect(0, 0, 100, 100).fill("red");
    assert.isDefined(graphics);
    assert.equal(graphics.width, 100);
    assert.equal(graphics.height, 100);
    assert.equal(graphics.position.x, 0);
    assert.equal(graphics.position.y, 0);

    graphics.position.set(200, 200);
    assert.equal(graphics.position.x, 200);
    assert.equal(graphics.position.y, 200);
  });

  test("checking if it works with app", async () => {
    const application = new Application();
    // global.HTMLCanvasElement = global.HTMLCanvasElement || class {};
    // global.window = global.window || {};

    await application.init({
      background: "#1088bb",
      antialias: true,
    });

    const graphics = new Graphics().rect(0, 0, 100, 100).fill("red");

    const texture =
      application.renderer.textureGenerator.generateTexture(graphics);
    assert.isDefined(texture);
    // assert.isTrue(false)
  });
});
