import { PHPMTRand } from "kol-rng";
import refuseItems from "./data/refuse.json";
import regularEffects from "./data/regular_effects.json";
import phylumEffects from "./data/phylum_effects.json";
import { Monster } from "./client";

type Phylum = keyof typeof phylumEffects;

function pickOne<T>(rng: PHPMTRand, array: T[]) {
  return array[rng.roll(0, array.length - 1)];
}

export function getBofaKillEffect(
  classId: number,
  pathId: number,
  monster: Monster,
): string {
  const seed = 421 * classId + 11 * pathId + monster.id;
  const rng = new PHPMTRand(seed);
  let phylumSpecific =
    pathId === 49 && monster.phylum === "bug" ? seed % 2 === 1 : seed % 3 === 1;

  const phylum = monster.phylum as Phylum | undefined;

  if (phylumSpecific && !phylum) {
    return "unknown because monster has unknown phylum";
  }

  const effect = pickOne(
    rng,
    phylumSpecific ? phylumEffects[phylum!] : regularEffects,
  );

  if (effect === "I Refuse!") {
    const refuseRng = new PHPMTRand(seed + 11);
    return pickOne(refuseRng, refuseItems);
  }

  if (Array.isArray(effect)) {
    const arrayRng = new PHPMTRand(seed + 13);
    return pickOne(arrayRng, effect);
  }

  if (effect === "some Meat (penguins)") {
    const meatRng = new PHPMTRand(seed + 12);
    return `some Meat@${meatRng.roll(0, 50) + 100} Meat`;
  }

  return effect;
}
