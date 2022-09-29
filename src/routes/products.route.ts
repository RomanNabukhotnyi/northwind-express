import express from 'express';

import ProductsController from '../controllers/products.controller';

const router = express.Router();

router.get('/', ProductsController.getAll);
router.get('/:id', ProductsController.getOne);

export default router;
