import { Donut, getShape } from "../../graphics/shape/shape";
import { Property } from "../../core/property";
import { Environment } from "../../utils/environment";

export type SpawnAreaConfig = {
  donut: Donut;
};

export type SpawnArea = ReturnType<typeof getSpawnArea>;

export function getSpawnArea(env: Environment, areaCoonfig: SpawnAreaConfig) {
  const { innerRadius, outerRadius } = areaCoonfig.donut;

  const graphics = getShape(env.app.containers.player, areaCoonfig.donut);

  const position = new Property({ x: 0, y: 0 });
  const getRandomAngle = () => Math.random() * Math.PI * 2;
  const getRandomRadius = () =>
    innerRadius + (outerRadius - innerRadius) * Math.random();
  const getRandomPosition = () => {
    const angle = getRandomAngle();
    const radius = getRandomRadius();
    const { x, y } = position.get();
    return {
      x: x + radius * Math.cos(angle),
      y: y + radius * Math.sin(angle),
    };
  };

  return {
    position,
    graphics,
    getRandomPosition,
  };
}
