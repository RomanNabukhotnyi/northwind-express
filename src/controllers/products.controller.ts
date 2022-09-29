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

export default class ProductsController {
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

    const { _count: { id: all } } = await prisma.product.aggregate({
      _count: {
        id: true,
      },
    });

    const page = Number(req.query.page) || 1;
    const ITEMS_PER_PAGE = Number(process.env.ITEMS_PER_PAGE);
    const pages = Math.ceil(all / ITEMS_PER_PAGE);

    const products = await prisma.product.findMany({
      skip: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    });
    res.send({
      page,
      pages,
      items: products.length,
      total: all,
      stats,
      products,
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

    const product = await prisma.product.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        supplier: true,
      },
    });
    if (!product) {
      res.status(404).send('Product not found');
      return;
    }
    const supplierName = product?.supplier?.companyName;
    delete (product as Partial<typeof product>)?.supplier;
    res.send({
      stats,
      product: {
        ...product,
        supplierName,
      },
    });
  }
}
