import GoogleStrategy from "passport-google-oauth20";
import authService from "../../services/auth.service.js";

const googleStrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
};

async function verify(accessToken, refreshToken, profile, done) {
  const user = await authService.oauthUser(
    profile.provider,
    profile.id,
    profile.emails[0].value,
    profile.displayName
  );
  done(null, user); // req.user = user;
}

const googleStrategy = new GoogleStrategy(googleStrategyOptions, verify);

export default googleStrategy;
