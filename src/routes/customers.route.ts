import express from 'express';

import CustomersController from '../controllers/customers.controller';

const router = express.Router();

router.get('/', CustomersController.getAll);
router.get('/:id', CustomersController.getOne);

export default router;
