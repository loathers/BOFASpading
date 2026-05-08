import {
  createClient,
  Monster as MonsterEntity,
  AscensionClass,
  Path as PathEntity,
} from "data-of-loathing";

const client = createClient();

export async function load() {
  await client.load();

  const [classes, paths, monsters] = await Promise.all([
    client.query.find(AscensionClass, {}),
    client.query.find(PathEntity, {}),
    client.query.find(MonsterEntity, {}, {
      populate: [
        "nativeLocations",
        "nativeLocations.location",
        "nativeLocations.location.nativeMonsters",
      ] as const,
    }),
  ]);

  return {
    classes: classes.map((c) => ({ id: c.id, name: c.name })),
    paths: paths.map((p) => ({ id: p.id, name: p.name })),
    monsters: monsters.map((m) => ({
      id: m.id,
      name: m.name,
      phylum: m.phylum === "undefined" ? undefined : m.phylum,
      nativeLocations: m.nativeLocations.getItems().map((nl) => ({
        weight: nl.weight,
        rejection: nl.rejection,
        parity: nl.parity ?? null,
        location: nl.location
          ? {
              combatRate: nl.location.combatRate,
              name: nl.location.name,
              nativeMonsters: nl.location.nativeMonsters
                .getItems()
                .map((nm) => ({ weight: nm.weight })),
            }
          : null,
      })),
    })),
  };
}

type LoadResult = Awaited<ReturnType<typeof load>>;

export type Monster = LoadResult["monsters"][number];
export type Class = LoadResult["classes"][number];
export type Path = LoadResult["paths"][number];
