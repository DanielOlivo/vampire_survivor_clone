import { Property } from "../property";
import { Signal } from "../signal";

export type CharacterConfig = {
  id: number;
  health: number;
  attack: number; // must be 0 for player
  attackInterval: number;
  shield: number;
};

export type Stats = ReturnType<typeof getCharacterStats>;

export function getCharacterStats(config: CharacterConfig) {
  const health = new Property(config.health);
  const attack = new Property(config.attack);
  const shield = new Property(config.shield);
  const interval = new Property(config.attackInterval);

  const damaged = new Signal<void>();
  const isDead = new Property(false, (a, b) => a === b);

  const reset = (): void => {
    health.set(config.health);
    attack.set(config.attack);
    shield.set(config.shield);
    interval.set(config.attackInterval);

    isDead.set(false);
  };

  /**
   *
   * @param attack - attack value of the attacker
   * @returns boolean - if this character dead after the attack
   */
  const handleDamage = (attack: number): boolean => {
    const healthUpd = Math.max(0, health.get() - attack / shield.get());

    if (healthUpd === health.get()) return isDead.get();

    health.set(healthUpd);
    if (healthUpd > 0) damaged.emit();
    else isDead.set(true);

    return isDead.get();
  };

  const toConsole = () => ({
    health: health.get(),
    attack: attack.get(),
    shield: shield.get(),
    isDead: isDead.get(),
  });

  return {
    reset,

    id: config.id,
    health,
    attack,
    shield,
    interval,

    isDead,

    handleDamage,

    damaged,

    toConsole,
  };
}
