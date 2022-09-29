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
class SearchController {
    static search(req, res) {
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
            const { q, table } = req.query;
            if (!q || !table) {
                res.status(400).send('Must provide search query and table');
                return;
            }
            if (table === 'products') {
                const results = yield prisma.product.findMany({
                    where: {
                        productName: {
                            contains: q,
                        },
                    },
                });
                res.send({
                    items: results.length,
                    stats,
                    results,
                });
            }
            else if (table === 'customers') {
                const results = yield prisma.customer.findMany({
                    where: {
                        OR: [
                            {
                                companyName: {
                                    contains: q,
                                },
                            },
                            {
                                contactName: {
                                    contains: q,
                                },
                            },
                            {
                                contactTitle: {
                                    contains: q,
                                },
                            },
                            {
                                address: {
                                    contains: q,
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
        });
    }
}
exports.default = SearchController;
//# sourceMappingURL=search.controller.js.map