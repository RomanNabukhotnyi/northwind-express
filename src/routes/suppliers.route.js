"use strict";
exports.__esModule = true;
var express_1 = require("express");
var suppliers_controller_1 = require("../controllers/suppliers.controller");
var router = express_1["default"].Router();
router.get('/', suppliers_controller_1["default"].getAll);
router.get('/:id', suppliers_controller_1["default"].getOne);
exports["default"] = router;
