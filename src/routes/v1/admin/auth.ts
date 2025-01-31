import { Router } from 'express';
import { validateSchema } from '../../../middleware/schemaValidation';
import { login } from '../../../controllers/admin/auth/authController';
import { loginSchema } from '../../../validation/adminValidation';
const router = Router();

router.post('/login', validateSchema(loginSchema), login);

export default router;