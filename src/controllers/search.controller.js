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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query'
        },
    ]
});
var SearchController = /** @class */ (function () {
    function SearchController() {
    }
    SearchController.search = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var stats, _a, q, table, results, results;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        stats = {
                            queries: 0,
                            results: 0,
                            log: []
                        };
                        prisma.$on('query', function (e) {
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
                                ts: e.timestamp
                            });
                        });
                        prisma.$use(function (params, prismaNext) { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, prismaNext(params)];
                                    case 1:
                                        result = _b.sent();
                                        stats.results += (_a = result === null || result === void 0 ? void 0 : result.length) !== null && _a !== void 0 ? _a : 1;
                                        return [2 /*return*/, result];
                                }
                            });
                        }); });
                        _a = req.query, q = _a.q, table = _a.table;
                        if (!q || !table) {
                            res.status(400).send('Must provide search query and table');
                            return [2 /*return*/];
                        }
                        if (!(table === 'products')) return [3 /*break*/, 2];
                        return [4 /*yield*/, prisma.product.findMany({
                                where: {
                                    productName: {
                                        contains: q
                                    }
                                }
                            })];
                    case 1:
                        results = _b.sent();
                        res.send({
                            items: results.length,
                            stats: stats,
                            results: results
                        });
                        return [3 /*break*/, 4];
                    case 2:
                        if (!(table === 'customers')) return [3 /*break*/, 4];
                        return [4 /*yield*/, prisma.customer.findMany({
                                where: {
                                    OR: [
                                        {
                                            companyName: {
                                                contains: q
                                            }
                                        },
                                        {
                                            contactName: {
                                                contains: q
                                            }
                                        },
                                        {
                                            contactTitle: {
                                                contains: q
                                            }
                                        },
                                        {
                                            address: {
                                                contains: q
                                            }
                                        },
                                    ]
                                }
                            })];
                    case 3:
                        results = _b.sent();
                        res.send({
                            items: results.length,
                            stats: stats,
                            results: results
                        });
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return SearchController;
}());
exports["default"] = SearchController;
