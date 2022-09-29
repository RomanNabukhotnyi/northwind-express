import express from 'express';

import EmployeesController from '../controllers/employees.controller';

const router = express.Router();

router.get('/', EmployeesController.getAll);
router.get('/:id', EmployeesController.getOne);

export default router;
