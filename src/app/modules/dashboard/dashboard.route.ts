import { Router } from 'express';
import { dashboardController } from './dashboard.controller';

const router = Router();

router.get('/dashboard/summary', dashboardController.getSummary);

export const dashboardRoutes = router;
