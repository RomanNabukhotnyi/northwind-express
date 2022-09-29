"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employees_controller_1 = __importDefault(require("../controllers/employees.controller"));
const router = express_1.default.Router();
router.get('/', employees_controller_1.default.getAll);
router.get('/:id', employees_controller_1.default.getOne);
exports.default = router;
//# sourceMappingURL=employees.route.js.map