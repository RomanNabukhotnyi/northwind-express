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

export default class OrdersController {
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

    const { _count: { id: all } } = await prisma.order.aggregate({
      _count: {
        id: true,
      },
    });

    const page = Number(req.query.page) || 1;
    const ITEMS_PER_PAGE = Number(process.env.ITEMS_PER_PAGE);
    const pages = Math.ceil(all / ITEMS_PER_PAGE);

    const orders = await prisma.order.findMany({
      skip: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      include: {
        OrderDetails: true,
      },
    });
    const result = orders.map((ord) => {
      const order = ord;
      const total = order.OrderDetails!.reduce(
        (acc, { quantity, unitPrice, discount }) => {
          acc.totalProductsDiscount += unitPrice * discount * quantity;
          acc.totalProductsPrice += unitPrice * quantity;
          acc.totalProductsItems += quantity;
          acc.totalProducts += 1;
          return acc;
        },
        {
          totalProductsDiscount: 0,
          totalProductsPrice: 0,
          totalProductsItems: 0,
          totalProducts: 0,
        },
      );
      delete (order as Partial<typeof order>).OrderDetails;
      return {
        ...total,
        ...order,
      };
    });
    res.send({
      page,
      pages,
      items: result.length,
      total: all,
      stats,
      orders: result,
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

    const order = await prisma.order.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        OrderDetails: {
          include: {
            product: true,
          },
        },
        shipper: true,
      },
    });
    if (!order) {
      res.status(404).send('Order not found');
      return;
    }
    const total = order?.OrderDetails?.reduce(
      (acc, { quantity, unitPrice, discount }) => {
        acc.totalProductsDiscount += unitPrice * discount * quantity;
        acc.totalProductsPrice += unitPrice * quantity;
        acc.totalProductsItems += quantity;
        acc.totalProducts += 1;
        return acc;
      },
      {
        totalProductsDiscount: 0,
        totalProductsPrice: 0,
        totalProductsItems: 0,
        totalProducts: 0,
      },
    );
    const shipViaCompanyName = order?.shipper?.companyName;
    const products = order?.OrderDetails?.map((orderDetail) => {
      const {
        product,
        quantity,
        unitPrice,
        discount,
        orderId,
      } = orderDetail;
      return {
        orderId,
        quantity,
        orderUnitPrice: unitPrice,
        discount,
        ...product,
      };
    });
    delete (order as Partial<typeof order>)?.OrderDetails;
    delete (order as Partial<typeof order>)?.shipper;
    res.send({
      stats,
      order: {
        shipViaCompanyName,
        ...total,
        ...order,
      },
      products,
    });
  }
}
