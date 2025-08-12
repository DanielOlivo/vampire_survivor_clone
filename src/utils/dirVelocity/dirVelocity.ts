import { Vector2 } from "@dimforge/rapier2d-compat";
import { V2 } from "../v2";
import { Property } from "../../core/property";

export type DirVelocity = ReturnType<typeof getDirVelocity>;

export function getDirVelocity(
  initSpeed: number = 0,
  initDir: Vector2 = { x: 0, y: 0 },
) {
  const dir = new Property(initDir);
  const speed = new Property(initSpeed);
  const linvel = new Property(V2.mulByScalar(initDir, initSpeed));

  const handleUpdate = (s: number, dir: Vector2) =>
    linvel.set(V2.mulByScalar(dir, s));

  const onDirUpdate = (dir: Vector2) => handleUpdate(speed.get(), dir);
  const onSpeedUpdate = (s: number) => handleUpdate(s, dir.get());

  dir.signal.connect(onDirUpdate);
  speed.signal.connect(onSpeedUpdate);

  return {
    dir,
    speed,
    linvel,
  };
}
