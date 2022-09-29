"use strict";
exports.__esModule = true;
var express_1 = require("express");
var employees_controller_1 = require("../controllers/employees.controller");
var router = express_1["default"].Router();
router.get('/', employees_controller_1["default"].getAll);
router.get('/:id', employees_controller_1["default"].getOne);
exports["default"] = router;
