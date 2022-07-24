import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { User } from '../models';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID as string,
      clientSecret: GOOGLE_CLIENT_SECRET as string,
      callbackURL: 'http://localhost:9000/auth/google/callback',
      passReqToCallback: true,
    },
    async (request: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
      let user = await User.findOne({ email: profile.email });
      if (!user) {
        user = await User.create({ email: profile.email, password: null, googleId: profile.id });
      }

      done(null, profile);
    }
  )
);

passport.serializeUser((user: any, cb) => cb(null, user.id));

passport.deserializeUser(async (id, cb) => {
  const user = await User.findOne({ googleId: id });
  if (!user) return cb(new Error('User not verified'), false);

  cb(null, user);
});
