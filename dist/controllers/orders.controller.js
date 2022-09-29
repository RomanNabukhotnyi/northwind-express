"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
    ],
});
class OrdersController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const stats = {
                queries: 0,
                results: 0,
                log: [],
            };
            prisma.$on('query', (e) => {
                stats.queries += 1;
                if (e.query.includes('SELECT') && e.query.includes('WHERE')) {
                    stats.select_where = stats.select_where ? stats.select_where + 1 : 1;
                }
                else if (e.query.includes('SELECT')) {
                    stats.select = stats.select ? stats.select + 1 : 1;
                }
                stats.log.push({
                    type: 'sql',
                    query: e.query,
                    duration: e.duration,
                    ts: e.timestamp,
                });
            });
            prisma.$use((params, prismaNext) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const result = yield prismaNext(params);
                stats.results += (_a = result === null || result === void 0 ? void 0 : result.length) !== null && _a !== void 0 ? _a : 1;
                return result;
            }));
            const { _count: { id: all } } = yield prisma.order.aggregate({
                _count: {
                    id: true,
                },
            });
            const page = Number(req.query.page) || 1;
            const ITEMS_PER_PAGE = Number(process.env.ITEMS_PER_PAGE);
            const pages = Math.ceil(all / ITEMS_PER_PAGE);
            const orders = yield prisma.order.findMany({
                skip: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
                take: ITEMS_PER_PAGE,
                include: {
                    OrderDetails: true,
                },
            });
            const result = orders.map((ord) => {
                const order = ord;
                const total = order.OrderDetails.reduce((acc, { quantity, unitPrice, discount }) => {
                    acc.totalProductsDiscount += unitPrice * discount * quantity;
                    acc.totalProductsPrice += unitPrice * quantity;
                    acc.totalProductsItems += quantity;
                    acc.totalProducts += 1;
                    return acc;
                }, {
                    totalProductsDiscount: 0,
                    totalProductsPrice: 0,
                    totalProductsItems: 0,
                    totalProducts: 0,
                });
                delete order.OrderDetails;
                return Object.assign(Object.assign({}, total), order);
            });
            res.send({
                page,
                pages,
                items: result.length,
                total: all,
                stats,
                orders: result,
            });
        });
    }
    static getOne(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const stats = {
                queries: 0,
                results: 0,
                log: [],
            };
            prisma.$on('query', (e) => {
                stats.queries += 1;
                if (e.query.includes('SELECT') && e.query.includes('WHERE')) {
                    stats.select_where = stats.select_where ? stats.select_where + 1 : 1;
                }
                else if (e.query.includes('SELECT')) {
                    stats.select = stats.select ? stats.select + 1 : 1;
                }
                stats.log.push({
                    type: 'sql',
                    query: e.query,
                    duration: e.duration,
                    ts: e.timestamp,
                });
            });
            prisma.$use((params, prismaNext) => __awaiter(this, void 0, void 0, function* () {
                var _d;
                const result = yield prismaNext(params);
                stats.results += (_d = result === null || result === void 0 ? void 0 : result.length) !== null && _d !== void 0 ? _d : 1;
                return result;
            }));
            const order = yield prisma.order.findUnique({
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
            const total = (_a = order === null || order === void 0 ? void 0 : order.OrderDetails) === null || _a === void 0 ? void 0 : _a.reduce((acc, { quantity, unitPrice, discount }) => {
                acc.totalProductsDiscount += unitPrice * discount * quantity;
                acc.totalProductsPrice += unitPrice * quantity;
                acc.totalProductsItems += quantity;
                acc.totalProducts += 1;
                return acc;
            }, {
                totalProductsDiscount: 0,
                totalProductsPrice: 0,
                totalProductsItems: 0,
                totalProducts: 0,
            });
            const shipViaCompanyName = (_b = order === null || order === void 0 ? void 0 : order.shipper) === null || _b === void 0 ? void 0 : _b.companyName;
            const products = (_c = order === null || order === void 0 ? void 0 : order.OrderDetails) === null || _c === void 0 ? void 0 : _c.map((orderDetail) => {
                const { product, quantity, unitPrice, discount, orderId, } = orderDetail;
                return Object.assign({ orderId,
                    quantity, orderUnitPrice: unitPrice, discount }, product);
            });
            order === null || order === void 0 ? true : delete order.OrderDetails;
            order === null || order === void 0 ? true : delete order.shipper;
            res.send({
                stats,
                order: Object.assign(Object.assign({ shipViaCompanyName }, total), order),
                products,
            });
        });
    }
}
exports.default = OrdersController;
//# sourceMappingURL=orders.controller.js.map