import { Router } from 'express';
import passport from "passport"
import { validateSchema, validateSchemaStep } from '../../middleware/schemaValidation';
import { generateOtpSchema, loginSchema, registerSchema, verifyLoginOtpSchema, verifyOtpSchema } from '../../validation/userValidation';
import { generateOtp, login, register, verifiedLoginOtp, verifiedOtp } from '../../controllers/userController/auth/authController';
const router = Router();

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/dashboard');
    }
);


router.post('/otp-generate', validateSchema(generateOtpSchema), generateOtp);
// router.post('/otp-verify', validateSchema(verifyOtpSchema), verifiedOtp);

router.post('/register', validateSchema(registerSchema), register);

router.post('/login', validateSchemaStep(), login);
router.post('/otp-verify', validateSchema(verifyLoginOtpSchema), verifiedLoginOtp);

export default router;