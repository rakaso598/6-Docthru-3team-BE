import passport from "passport";
import googleStrategy from "./googleStrategy.js";

passport.use("google", googleStrategy);
