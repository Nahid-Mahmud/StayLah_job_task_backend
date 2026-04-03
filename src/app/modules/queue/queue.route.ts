import { Router } from 'express';
import { queueController } from './queue.controller';

const router = Router();

router.get('/status', queueController.getStatus);

export const queueRoutes = router;
