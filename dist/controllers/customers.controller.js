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
class CustomersController {
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
            const { _count: { id: all }, } = yield prisma.customer.aggregate({
                _count: {
                    id: true,
                },
            });
            const page = Number(req.query.page) || 1;
            const ITEMS_PER_PAGE = Number(process.env.ITEMS_PER_PAGE);
            const pages = Math.ceil(all / ITEMS_PER_PAGE);
            const customers = yield prisma.customer.findMany({
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
        });
    }
    static getOne(req, res) {
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
            const customer = yield prisma.customer.findUnique({
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
        });
    }
}
exports.default = CustomersController;
//# sourceMappingURL=customers.controller.js.map