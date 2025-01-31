import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../../../models/userModel';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ socialId: profile.id, provider: 'google' });

        if (!user) {
            user = new User({
                email: profile.emails![0].value,
                name: profile.displayName,
                socialId: profile.id,
                provider: 'google',
                avatarUrl: profile.photos![0].value,
            });

            await user.save();
        }

        done(null, user);
    } catch (error) {
        done(error);
    }
}));
