import { PHPMTRand } from 'kol-rng';
import refuseItems from './refuse.json';
import regularEffects from './regular_effects.json';
import phylumEffects from './phylum_effects.json';
import { Monster } from './entities';

type Phylum = keyof typeof phylumEffects;

const monsterZonesInfo: { [key: string]: any[][] } = {
  // Add monster zone info here
};

export function getBofaKillEffect(classId: number, pathId: number, monster: Monster): string {
  const seed = 421 * classId + 11 * pathId + monster.id;
  const rng = new PHPMTRand(seed);
  
  const phylum = monster.phylum as Phylum | undefined;

  let effect: string | string[] | null = null;
  let isPhylumSpecific = false;

  if (pathId === 49 && monster.phylum === "bug") {
    if (seed % 2 === 1) {
      isPhylumSpecific = true;
    }
  } else {
    if (seed % 3 === 1) {
      isPhylumSpecific = true;
    }
  }

  if (isPhylumSpecific) {
    if (!phylum) return "unknown because monster has unknown phylum";
    const phylumEffectsList = phylumEffects[phylum] || [];
    effect = phylumEffectsList[rng.roll(0, phylumEffectsList.length - 1)];
  } else {
    effect = regularEffects[rng.roll(0, regularEffects.length - 1)];
  }

  console.log(effect, isPhylumSpecific, monster.name, phylum);

  if (effect === "I Refuse!") {
    const refuseRng = new PHPMTRand(seed + 11);
    return refuseItems[refuseRng.roll(0, refuseItems.length - 1)];
  }

  if (Array.isArray(effect)) {
    const arrayRng = new PHPMTRand(seed + 13);
    return effect[arrayRng.roll(0, effect.length - 1)];
  }

  if (effect === "some Meat (penguins)") {
    const meatRng = new PHPMTRand(seed + 12);
    return `some Meat@${meatRng.roll(0, 50) + 100} Meat`;
  }

  return effect;
}

export function getMonsterZoneDescriptions(monsterName: string): string[] {
  if (!monsterZonesInfo[monsterName]) return [];
  
  const monsterZones = monsterZonesInfo[monsterName];
  const res: string[] = [];

  for (const monsterZone of monsterZones) {
    let resEntry = monsterZone[0];
    let isSpecial = false;
    let isUr = false;
    let rejection = 0;
    let copies = 1;
    let specialInfo = "";

    for (let i = 3; i < monsterZone.length; i++) {
      const zoneData = monsterZone[i];
      if (zoneData === 'special') isSpecial = true;
      if (zoneData === 'UR') isUr = true;
      if (zoneData === 'rejection') {
        i += 1;
        rejection = parseInt(monsterZone[i]);
      }
      if (zoneData === 'copies') {
        i += 1;
        copies = parseInt(monsterZone[i]);
      }
      if (zoneData === 'even' || zoneData === 'odd') {
        specialInfo = `${zoneData} ascensions`;
      }
    }

    if (isUr) {
      resEntry = `${monsterZone[0]} (ultra-rare)`;
    } else if (isSpecial) {
      resEntry = `${monsterZone[0]} (special)`;
    } else {
      resEntry += ` (${monsterZone[1]}% combat`;
      if (parseInt(monsterZone[2]) > 1) resEntry += `, ${monsterZone[2]} monsters`;
      if (copies > 1) resEntry += `, ${copies} copies`;
      if (rejection > 0) resEntry += `, ${rejection}% rejection rate`;
      if (specialInfo !== "") resEntry += `, ${specialInfo}`;
      resEntry += ")";
    }
    res.push(resEntry);
  }
  return res;
} 