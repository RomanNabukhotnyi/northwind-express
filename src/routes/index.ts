import express from 'express';

import suppliersRoutes from './suppliers.route';
import customersRoutes from './customers.route';
import productsRoutes from './products.route';
import ordersRoutes from './orders.route';
import employeesRoutes from './employees.route';

import SearchController from '../controllers/search.controller';

const router = express.Router();

router.use('/suppliers', suppliersRoutes);
router.use('/products', productsRoutes);
router.use('/orders', ordersRoutes);
router.use('/employees', employeesRoutes);
router.use('/customers', customersRoutes);

router.get('/search', SearchController.search);

export default router;
