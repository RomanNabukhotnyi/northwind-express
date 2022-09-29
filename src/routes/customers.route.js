"use strict";
exports.__esModule = true;
var express_1 = require("express");
var customers_controller_1 = require("../controllers/customers.controller");
var router = express_1["default"].Router();
router.get('/', customers_controller_1["default"].getAll);
router.get('/:id', customers_controller_1["default"].getOne);
exports["default"] = router;
