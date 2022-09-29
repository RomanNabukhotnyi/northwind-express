"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customers_controller_1 = __importDefault(require("../controllers/customers.controller"));
const router = express_1.default.Router();
router.get('/', customers_controller_1.default.getAll);
router.get('/:id', customers_controller_1.default.getOne);
exports.default = router;
//# sourceMappingURL=customers.route.js.map