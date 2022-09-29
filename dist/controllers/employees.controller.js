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
/* eslint-disable no-underscore-dangle */
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
    ],
});
class EmployeesController {
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
            const { _count: { id: all }, } = yield prisma.employee.aggregate({
                _count: {
                    id: true,
                },
            });
            const page = Number(req.query.page) || 1;
            const ITEMS_PER_PAGE = Number(process.env.ITEMS_PER_PAGE);
            const pages = Math.ceil(all / ITEMS_PER_PAGE);
            const employees = yield prisma.employee.findMany({
                skip: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
                take: ITEMS_PER_PAGE,
            });
            res.send({
                page,
                pages,
                items: employees.length,
                total: all,
                stats,
                employees,
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
            const employee = yield prisma.employee.findUnique({
                where: {
                    id: Number(req.params.id),
                },
                include: {
                    employee: true,
                },
            });
            if (!employee) {
                res.status(404).send({
                    message: 'Employee not found',
                });
                return;
            }
            const reportId = (_a = employee === null || employee === void 0 ? void 0 : employee.employee) === null || _a === void 0 ? void 0 : _a.id;
            const reportFirstName = (_b = employee === null || employee === void 0 ? void 0 : employee.employee) === null || _b === void 0 ? void 0 : _b.firstName;
            const reportLastName = (_c = employee === null || employee === void 0 ? void 0 : employee.employee) === null || _c === void 0 ? void 0 : _c.lastName;
            employee === null || employee === void 0 ? true : delete employee.employee;
            res.send({
                stats,
                employee: Object.assign({ reportId,
                    reportFirstName,
                    reportLastName }, employee),
            });
        });
    }
}
exports.default = EmployeesController;
//# sourceMappingURL=employees.controller.js.map