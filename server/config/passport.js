import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import dotenv from 'dotenv';
import User from '../models/User.js'; // Ensure User model accepts OAuth fields

dotenv.config();

// Serialize User
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize User
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists
            let user = await User.findOne({ googleId: profile.id });
            
            if (!user) {
                // Creates a new user if no match found
                user = await User.create({
                    googleId: profile.id,
                    name: profile.displayName || profile.emails[0].value.split('@')[0],
                    email: profile.emails[0].value,
                    authProvider: 'google',
                    isVerified: true,
                });
            }
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }));
} else {
    console.warn("Google OAuth credentials missing from .env");
}

// GitHub Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/api/auth/github/callback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
            if(!email){
                email = `${profile.username}@github.com`; // Fallback email
            }
            let user = await User.findOne({ githubId: profile.id });

            if (!user) {
                user = await User.create({
                    githubId: profile.id,
                    name: profile.username || profile.displayName || 'GitHub User',
                    email: email,
                    authProvider: 'github',
                    isVerified: true
                });
            }
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }));
} else {
    console.warn("GitHub OAuth credentials missing from .env");
}

export default passport;
