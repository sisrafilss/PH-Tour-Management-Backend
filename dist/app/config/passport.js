"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
const passport_1 = __importDefault(require("passport"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_local_1 = require("passport-local");
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const env_1 = require("./env");
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isUserExists = yield user_model_1.User.findOne({ email });
        if (!isUserExists) {
            return done("User does not exist");
        }
        if (!isUserExists.isVerified) {
            // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified!");
            return done("User is not verified!");
        }
        if (isUserExists.isActive === user_interface_1.IsActive.BLOCKED ||
            isUserExists.isActive === user_interface_1.IsActive.INACTIVE) {
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
        const isGoogleAuthnticated = isUserExists.auths.some((providerObject) => providerObject.provider === "google");
        if (isGoogleAuthnticated && !isUserExists.password) {
            return done(null, false, {
                message: "You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password.",
            });
        }
        const isPasswordMatched = yield bcryptjs_1.default.compare(password, isUserExists.password);
        if (!isPasswordMatched) {
            return done(null, false, { message: "Incorrect Password" });
        }
        return done(null, isUserExists);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
})));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVars.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.envVars.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        if (!email) {
            return done(null, false, { message: "No email found!" });
        }
        let isUserExists = yield user_model_1.User.findOne({ email }).select("-password");
        if (isUserExists && !isUserExists.isVerified) {
            return done(null, false, { message: "User is not verified!" });
        }
        if (isUserExists &&
            (isUserExists.isActive === user_interface_1.IsActive.BLOCKED ||
                isUserExists.isActive === user_interface_1.IsActive.INACTIVE)) {
            return done(`User is ${isUserExists.isActive}`);
        }
        if (isUserExists && isUserExists.isDeleted) {
            return done("User is deleted!");
        }
        if (!isUserExists) {
            isUserExists = yield user_model_1.User.create({
                email,
                name: profile.displayName,
                picture: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value,
                role: user_interface_1.Role.USER,
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
    }
    catch (error) {
        console.log("Google Strategy error:", error);
        done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
}));
