import { Router } from 'express';
import { csvController } from './csv.controller';
import { multerUpload } from '../../config/multer.config';

const router = Router();

router.post('/upload', multerUpload.single('file'), csvController.uploadCSV);

export const csvRoutes = router;
