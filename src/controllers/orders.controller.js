"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var OrdersController = /** @class */ (function () {
    function OrdersController() {
    }
    OrdersController.getAll = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var stats, all, page, ITEMS_PER_PAGE, pages, orders, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
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
                        return [4 /*yield*/, prisma.order.aggregate({
                                _count: {
                                    id: true
                                }
                            })];
                    case 1:
                        all = (_a.sent())._count.id;
                        page = Number(req.query.page) || 1;
                        ITEMS_PER_PAGE = Number(process.env.ITEMS_PER_PAGE);
                        pages = Math.ceil(all / ITEMS_PER_PAGE);
                        return [4 /*yield*/, prisma.order.findMany({
                                skip: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
                                take: ITEMS_PER_PAGE,
                                include: {
                                    OrderDetails: true
                                }
                            })];
                    case 2:
                        orders = _a.sent();
                        result = orders.map(function (ord) {
                            var order = ord;
                            var total = order.OrderDetails.reduce(function (acc, _a) {
                                var quantity = _a.quantity, unitPrice = _a.unitPrice, discount = _a.discount;
                                acc.totalProductsDiscount += unitPrice * discount * quantity;
                                acc.totalProductsPrice += unitPrice * quantity;
                                acc.totalProductsItems += quantity;
                                acc.totalProducts += 1;
                                return acc;
                            }, {
                                totalProductsDiscount: 0,
                                totalProductsPrice: 0,
                                totalProductsItems: 0,
                                totalProducts: 0
                            });
                            delete order.OrderDetails;
                            return __assign(__assign({}, total), order);
                        });
                        res.send({
                            page: page,
                            pages: pages,
                            items: result.length,
                            total: all,
                            stats: stats,
                            orders: result
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    OrdersController.getOne = function (req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var stats, order, total, shipViaCompanyName, products;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
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
                        return [4 /*yield*/, prisma.order.findUnique({
                                where: {
                                    id: Number(req.params.id)
                                },
                                include: {
                                    OrderDetails: {
                                        include: {
                                            product: true
                                        }
                                    },
                                    shipper: true
                                }
                            })];
                    case 1:
                        order = _d.sent();
                        if (!order) {
                            res.status(404).send('Order not found');
                            return [2 /*return*/];
                        }
                        total = (_a = order === null || order === void 0 ? void 0 : order.OrderDetails) === null || _a === void 0 ? void 0 : _a.reduce(function (acc, _a) {
                            var quantity = _a.quantity, unitPrice = _a.unitPrice, discount = _a.discount;
                            acc.totalProductsDiscount += unitPrice * discount * quantity;
                            acc.totalProductsPrice += unitPrice * quantity;
                            acc.totalProductsItems += quantity;
                            acc.totalProducts += 1;
                            return acc;
                        }, {
                            totalProductsDiscount: 0,
                            totalProductsPrice: 0,
                            totalProductsItems: 0,
                            totalProducts: 0
                        });
                        shipViaCompanyName = (_b = order === null || order === void 0 ? void 0 : order.shipper) === null || _b === void 0 ? void 0 : _b.companyName;
                        products = (_c = order === null || order === void 0 ? void 0 : order.OrderDetails) === null || _c === void 0 ? void 0 : _c.map(function (orderDetail) {
                            var product = orderDetail.product, quantity = orderDetail.quantity, unitPrice = orderDetail.unitPrice, discount = orderDetail.discount, orderId = orderDetail.orderId;
                            return __assign({ orderId: orderId, quantity: quantity, orderUnitPrice: unitPrice, discount: discount }, product);
                        });
                        order === null || order === void 0 ? true : delete order.OrderDetails;
                        order === null || order === void 0 ? true : delete order.shipper;
                        res.send({
                            stats: stats,
                            order: __assign(__assign({ shipViaCompanyName: shipViaCompanyName }, total), order),
                            products: products
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return OrdersController;
}());
exports["default"] = OrdersController;
