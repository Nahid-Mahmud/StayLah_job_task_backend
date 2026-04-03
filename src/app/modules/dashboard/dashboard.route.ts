import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { dashboardValidation } from './dashboard.validation';
import { validateRequest } from '../../../middlewares/validateRequest';

const router = Router();

router.get(
  '/dashboard/summary',
  validateRequest(dashboardValidation.getSummaryValidationSchema),
  dashboardController.getSummary
);

export const dashboardRoutes = router;
