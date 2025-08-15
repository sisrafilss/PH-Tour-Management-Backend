/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import passport from "passport";

import bcrypt from "bcryptjs";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { IsActive, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { envVars } from "./env";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExists = await User.findOne({ email });

        if (!isUserExists) {
          return done("User does not exist");
        }

        if (!isUserExists.isVerified) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified!");
          return done("User is not verified!");
        }

        if (
          isUserExists.isActive === IsActive.BLOCKED ||
          isUserExists.isActive === IsActive.INACTIVE
        ) {
          // throw new AppError(
          //   httpStatus.BAD_REQUEST,
          //   `User is ${isUserExists.isActive}`
          // );
          return done(`User is ${isUserExists.isActive}`);
        }

        if (isUserExists.isDeleted) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User is deleted!");
          return done("User is deleted!");
        }

        const isGoogleAuthnticated = isUserExists.auths.some(
          (providerObject) => providerObject.provider === "google"
        );

        if (isGoogleAuthnticated && !isUserExists.password) {
          return done(null, false, {
            message:
              "You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password.",
          });
        }

        const isPasswordMatched = await bcrypt.compare(
          password as string,
          isUserExists.password as string
        );
        if (!isPasswordMatched) {
          return done(null, false, { message: "Incorrect Password" });
        }

        return done(null, isUserExists);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: "No email found!" });
        }

        let isUserExists = await User.findOne({ email }).select("-password");

        if (isUserExists && !isUserExists.isVerified) {
          return done(null, false, { message: "User is not verified!" });
        }

        if (
          isUserExists &&
          (isUserExists.isActive === IsActive.BLOCKED ||
            isUserExists.isActive === IsActive.INACTIVE)
        ) {
          return done(`User is ${isUserExists.isActive}`);
        }

        if (isUserExists && isUserExists.isDeleted) {
          return done("User is deleted!");
        }

        if (!isUserExists) {
          isUserExists = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }
        return done(null, isUserExists);
      } catch (error) {
        console.log("Google Strategy error:", error);
        done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
