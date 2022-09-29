"use strict";
exports.__esModule = true;
var express_1 = require("express");
var orders_controller_1 = require("../controllers/orders.controller");
var router = express_1["default"].Router();
router.get('/', orders_controller_1["default"].getAll);
router.get('/:id', orders_controller_1["default"].getOne);
exports["default"] = router;
