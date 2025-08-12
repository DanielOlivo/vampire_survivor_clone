export enum CollisionGroup {
  Wall = 1 << 0,
  Player = 1 << 1,
  PlayerSensor = 1 << 2,
  Enemy = 1 << 3,
  ExpItem = 1 << 4,
  ExpItemSensor = 1 << 5,
  GrabSensor = 1 << 6,
  Weapon = 1 << 7,
  GrabSensor2 = 1 << 8,
}

function getCollisionGroup(membership: number, filter: number) {
  return (membership << 16) | filter;
}

export const collisionGroups = {
  // player
  player: getCollisionGroup(
    CollisionGroup.Player,
    CollisionGroup.Wall | CollisionGroup.ExpItem,
  ),

  grabSensor: getCollisionGroup(
    CollisionGroup.GrabSensor,
    CollisionGroup.ExpItem,
  ),
  grabsensor2: getCollisionGroup(
    CollisionGroup.GrabSensor2,
    CollisionGroup.ExpItem,
  ),

  hitSensor: getCollisionGroup(
    CollisionGroup.PlayerSensor,
    CollisionGroup.Enemy,
  ),

  enemy: getCollisionGroup(
    CollisionGroup.Enemy,
    CollisionGroup.PlayerSensor | CollisionGroup.Enemy | CollisionGroup.Weapon,
  ),

  expItem: getCollisionGroup(
    CollisionGroup.ExpItem,
    CollisionGroup.GrabSensor | CollisionGroup.GrabSensor2,
  ),

  weapon: getCollisionGroup(CollisionGroup.Weapon, CollisionGroup.Enemy),

  wall: getCollisionGroup(CollisionGroup.Wall, CollisionGroup.Player),
};
