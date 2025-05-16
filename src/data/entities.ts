import { createClient } from "data-of-loathing";

const client = createClient();

export async function load() {
  const data = await client.query({
    allClasses: {
      nodes: {
        id: true,
        name: true,
      }
    },
    allPaths: {
      nodes: {
        id: true,
        name: true,
      }
    },
    allMonsters: {
      nodes: {
        id: true,
        name: true,
        phylum: true,
      }
    }
  });

  return {
    classes: (data.allClasses?.nodes || []).filter(m => m !== null),
    paths: (data.allPaths?.nodes || []).filter(m => m !== null),
    monsters: (data.allMonsters?.nodes || []).filter(m => m !== null).map(m => ({ ...m, phylum: m.phylum === "undefined" ? undefined : m.phylum })),
  }
}

type LoadResult = Awaited<ReturnType<typeof load>>;

export type Monster = LoadResult["monsters"][number];
export type Class = LoadResult["classes"][number];
export type Path = LoadResult["paths"][number];