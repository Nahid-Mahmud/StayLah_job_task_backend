import { Router } from 'express';
import { UserRole } from '@prisma/client';

import { userController } from './user.controller';
import { checkAuth } from '../../../middlewares/checkAuth';

const router = Router();

router.get(
  '/me',
  checkAuth(...Object.values(UserRole)), // Allow all roles to access their profile
  userController.getMe
);

export const userRoutes = router;
