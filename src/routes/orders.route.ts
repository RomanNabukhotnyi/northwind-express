import express from 'express';

import OrdersController from '../controllers/orders.controller';

const router = express.Router();

router.get('/', OrdersController.getAll);
router.get('/:id', OrdersController.getOne);

export default router;
