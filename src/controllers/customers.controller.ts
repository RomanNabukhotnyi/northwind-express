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

export default class CustomersController {
  static async getAll(req: Request, res: Response) {
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

    const {
      _count: { id: all },
    } = await prisma.customer.aggregate({
      _count: {
        id: true,
      },
    });

    const page = Number(req.query.page) || 1;
    const ITEMS_PER_PAGE = Number(process.env.ITEMS_PER_PAGE);
    const pages = Math.ceil(all / ITEMS_PER_PAGE);

    const customers = await prisma.customer.findMany({
      skip: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    });
    res.send({
      page,
      pages,
      items: customers.length,
      total: all,
      stats,
      customers,
    });
  }

  static async getOne(req: Request, res: Response) {
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

    const customer = await prisma.customer.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (!customer) {
      res.status(404).send({ message: 'Customer not found' });
      return;
    }
    res.send({
      stats,
      customer,
    });
  }
}
