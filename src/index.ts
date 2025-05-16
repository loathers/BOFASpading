import express, { Request, Response } from 'express';
import path from 'path';
import { getBofaKillEffect } from './data/monsters';
import { load } from './data/entities';

const app = express();
const port = process.env.PORT || 3000;

// Set up EJS as the view engine
app
  .set('view engine', 'ejs')
  .set('views', path.join(__dirname, 'views'))
  .get('/', async (req: Request, res: Response) => {
    const { classes, monsters, paths } = await load();
    const classId = parseInt(req.query.class as string) || 1;
    const pathId = parseInt(req.query.path as string) || 0;

    const results = monsters.reduce<Record<string, { monster: string; comment: string }[]>>((acc, monster) => {
      const effect = getBofaKillEffect(classId, pathId, monster);
      const [effectName, effectComment = ""] = effect.split("@");
      
      return {
        ...acc,
        [effectName]: [...(acc[effectName] || []), { monster: monster.name, comment: effectComment }]
      };
    }, {});

    // Sort the results
    const sortedResults = Object.fromEntries(
      Object.entries(results).sort(([a], [b]) => a.localeCompare(b))
    );

    res.render('index', {
      classes,
      paths,
      results: sortedResults,
      selectedClass: classId,
      selectedPath: pathId
    });
  })
  .listen(port, () => {
    console.log(`Server is running on port ${port}`);
  }); 