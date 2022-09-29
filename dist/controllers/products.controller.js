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
class ProductsController {
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
            const { _count: { id: all } } = yield prisma.product.aggregate({
                _count: {
                    id: true,
                },
            });
            const page = Number(req.query.page) || 1;
            const ITEMS_PER_PAGE = Number(process.env.ITEMS_PER_PAGE);
            const pages = Math.ceil(all / ITEMS_PER_PAGE);
            const products = yield prisma.product.findMany({
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
        });
    }
    static getOne(req, res) {
        var _a;
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
                var _b;
                const result = yield prismaNext(params);
                stats.results += (_b = result === null || result === void 0 ? void 0 : result.length) !== null && _b !== void 0 ? _b : 1;
                return result;
            }));
            const product = yield prisma.product.findUnique({
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
            const supplierName = (_a = product === null || product === void 0 ? void 0 : product.supplier) === null || _a === void 0 ? void 0 : _a.companyName;
            product === null || product === void 0 ? true : delete product.supplier;
            res.send({
                stats,
                product: Object.assign(Object.assign({}, product), { supplierName }),
            });
        });
    }
}
exports.default = ProductsController;
//# sourceMappingURL=products.controller.js.map