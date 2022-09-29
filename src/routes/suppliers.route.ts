import express from 'express';

import SuppliersController from '../controllers/suppliers.controller';

const router = express.Router();

router.get('/', SuppliersController.getAll);
router.get('/:id', SuppliersController.getOne);

export default router;
