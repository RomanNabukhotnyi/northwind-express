"use strict";
exports.__esModule = true;
var express_1 = require("express");
var products_controller_1 = require("../controllers/products.controller");
var router = express_1["default"].Router();
router.get('/', products_controller_1["default"].getAll);
router.get('/:id', products_controller_1["default"].getOne);
exports["default"] = router;
