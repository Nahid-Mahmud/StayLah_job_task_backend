import { Router } from 'express';
import { formController } from './form.controller';
import { formValidation } from './form.validation';
import { validateRequest } from '../../../middlewares/validateRequest';

const router = Router();

router.post(
  '/',
  validateRequest(formValidation.createFormValidationSchema),
  formController.createForm
);
router.get(
  '/:id',
  validateRequest(formValidation.getFormByIdValidationSchema),
  formController.getFormById
);
router.post(
  '/:id/submit',
  validateRequest(formValidation.submitFormValidationSchema),
  formController.submitForm
);

export const formRoutes = router;
