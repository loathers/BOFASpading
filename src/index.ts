import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";

import { getBofaKillEffect, getMonsterZoneDescriptions } from "./monsters";
import { load } from "./client";
import memoize from "memoize";

const memoizedLoad = memoize(load, { maxAge: 1000 * 60 * 15 });

const app = express();
const port = process.env.PORT || 3000;

// Set up EJS as the view engine
app
  .set("view engine", "ejs")
  .set("views", path.join(fileURLToPath(import.meta.url), "../views"))
  .get("/", async (req: Request, res: Response) => {
    const { classes, monsters, paths } = await memoizedLoad();

    const classId = parseInt(req.query.class?.toString() || "1");
    const pathId = parseInt(req.query.path?.toString() || "0");

    const results = monsters.reduce<
      Record<string, { monster: string; comment: string }[]>
    >((acc, monster) => {
      const effect = getBofaKillEffect(classId, pathId, monster);
      const [effectName, effectComment = ""] = effect.split("@");
      const zones = getMonsterZoneDescriptions(monster);

      return {
        ...acc,
        [effectName]: [
          ...(acc[effectName] || []),
          { monster: monster.name, comment: effectComment, zones },
        ],
      };
    }, {});

    // Sort the results
    const sortedResults = Object.fromEntries(
      Object.entries(results).sort(([a], [b]) => a.localeCompare(b)),
    );

    res.render("index", {
      classes,
      paths,
      results: sortedResults,
      selectedClass: classId,
      selectedPath: pathId,
    });
  })
  .listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
