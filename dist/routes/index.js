"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const suppliers_route_1 = __importDefault(require("./suppliers.route"));
const customers_route_1 = __importDefault(require("./customers.route"));
const products_route_1 = __importDefault(require("./products.route"));
const orders_route_1 = __importDefault(require("./orders.route"));
const employees_route_1 = __importDefault(require("./employees.route"));
const search_controller_1 = __importDefault(require("../controllers/search.controller"));
const router = express_1.default.Router();
router.use('/suppliers', suppliers_route_1.default);
router.use('/products', products_route_1.default);
router.use('/orders', orders_route_1.default);
router.use('/employees', employees_route_1.default);
router.use('/customers', customers_route_1.default);
router.get('/search', search_controller_1.default.search);
exports.default = router;
//# sourceMappingURL=index.js.map