import { Router } from 'express';
import { searchController } from './search.controller';
import { searchValidation } from './search.validation';
import { validateRequest } from '../../../middlewares/validateRequest';

const router = Router();

router.get(
  '/',
  validateRequest(searchValidation.searchHotelsValidationSchema),
  searchController.searchHotels
);

export const searchRoutes = router;
