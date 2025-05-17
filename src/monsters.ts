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

export function getMonsterZoneDescriptions(monster: Monster) {
  return monster.nativeMonstersByMonster.nodes.map((nativeMonster) =>
    getMonsterZoneDescription(nativeMonster),
  );
}

type NativeMonster = Monster["nativeMonstersByMonster"]["nodes"][number];

function getMonsterZoneDescription(nativeMonster: NativeMonster) {
  if (!nativeMonster) return "";

  const location = nativeMonster.locationByLocation?.name ?? "Unknown location";

  return `${location} (${getMonsterZoneDetails(nativeMonster)})`;
}

function getMonsterZoneDetails(nativeMonster: NonNullable<NativeMonster>) {
  switch (nativeMonster.weight) {
    case -1:
      return "ultra-rare";
    case 0:
      return "special";
    default: {
      const details = [];
      const location = nativeMonster.locationByLocation;
      if (location) {
        const rate =
          location.combatRate >= 0 ? `${location.combatRate}%` : "unspaded";
        details.push(`combat rate: ${rate}`);
        const monsters = location.nativeMonstersByLocation.nodes.filter(
          (m) => m && m.weight > 0,
        ).length;
        if (monsters > 1) details.push(`${monsters} monsters`);
      }
      if (nativeMonster.weight > 1)
        details.push(`${nativeMonster.weight} copies`);
      if (nativeMonster.rejection > 0)
        details.push(`${nativeMonster.rejection}% rejection`);
      if (nativeMonster.parity !== null)
        details.push(
          `${nativeMonster.parity % 2 === 0 ? "even" : "odd"} ascensions`,
        );
      return details.join(", ");
    }
  }
}
