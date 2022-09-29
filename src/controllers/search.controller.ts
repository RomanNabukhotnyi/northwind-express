import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

export default class SearchController {
  static async search(req: Request, res: Response) {
    const stats: {
      queries: number;
      results: number;
      select?: number;
      select_where?: number;
      log: {
        type: string;
        query: string;
        duration: number;
        ts: Date;
      }[];
    } = {
      queries: 0,
      results: 0,
      log: [],
    };

    prisma.$on('query', (e) => {
      stats.queries += 1;
      if (e.query.includes('SELECT') && e.query.includes('WHERE')) {
        stats.select_where = stats.select_where ? stats.select_where + 1 : 1;
      } else if (e.query.includes('SELECT')) {
        stats.select = stats.select ? stats.select + 1 : 1;
      }
      stats.log.push({
        type: 'sql',
        query: e.query,
        duration: e.duration,
        ts: e.timestamp,
      });
    });

    prisma.$use(async (params, prismaNext) => {
      const result = await prismaNext(params);

      stats.results += result?.length ?? 1;

      return result;
    });

    const { q, table } = req.query;
    if (!q || !table) {
      res.status(400).send('Must provide search query and table');
      return;
    }
    if (table === 'products') {
      const results = await prisma.product.findMany({
        where: {
          productName: {
            contains: q as string,
          },
        },
      });
      res.send({
        items: results.length,
        stats,
        results,
      });
    } else if (table === 'customers') {
      const results = await prisma.customer.findMany({
        where: {
          OR: [
            {
              companyName: {
                contains: q as string,
              },
            },
            {
              contactName: {
                contains: q as string,
              },
            },
            {
              contactTitle: {
                contains: q as string,
              },
            },
            {
              address: {
                contains: q as string,
              },
            },
          ],
        },
      });
      res.send({
        items: results.length,
        stats,
        results,
      });
    }
  }
}
