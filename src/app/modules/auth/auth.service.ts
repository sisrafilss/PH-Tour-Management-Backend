/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { sendEmail } from "../../utils/sendEmail";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userToken";
import { IAuthProvider, IsActive } from "../user/user.interface";
import { User } from "../user/user.model";

// const credentialsLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;

//   const isUserExists = await User.findOne({ email });
//   if (!isUserExists) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
//   }

//   const isPasswordMatched = await bcrypt.compare(
//     password as string,
//     isUserExists.password as string
//   );
//   if (!isPasswordMatched) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
//   }

//   const userTokens = createUserTokens(isUserExists);

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { password: _, ...rest } = isUserExists.toObject();

//   return {
//     accessToken: userTokens.accessToken,
//     refreshToken: userTokens.refreshToken,
//     user: { ...rest },
//   };
// };

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );
  return {
    accessToken: newAccessToken,
  };
};

const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (
    user.password &&
    user.auths.some((providerObject) => providerObject.provider === "google")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already set you password. Now you can change the password from your profile password update"
    );
  }

  const hashedPassword = await bcrypt.hash(
    plainPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const credentialProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email,
  };

  const auths: IAuthProvider[] = [...user.auths, credentialProvider];

  user.password = hashedPassword;

  user.auths = auths;

  await user.save();
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  const isOldPasswordMatch = await bcrypt.compare(
    oldPassword,
    user!.password as string
  );
  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not match!");
  }

  user!.password = await bcrypt.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  user?.save();
};

const forgotPassword = async (email: string) => {
  const isUserExists = await User.findOne({ email });

  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }

  if (
    isUserExists.isActive === IsActive.BLOCKED ||
    isUserExists.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is ${isUserExists.isActive}`
    );
  }

  if (isUserExists.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is deleted!");
  }

  if (!isUserExists.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not verified!");
  }

  const jwtPayload = {
    userId: isUserExists._id,
    email: isUserExists.email,
    role: isUserExists.role,
  };

  const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: "10m",
  });

  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExists._id}&token=${resetToken}`;

  sendEmail({
    to: isUserExists.email,
    subject: "Password Reset",
    templateName: "forgotPassword",
    templateData: {
      name: isUserExists.name,
      resetUILink,
    },
  });
};

const resetPassword = async (
  payload: Record<string, string>,
  decodedToken: JwtPayload
) => {
  if (payload.id !== decodedToken.userId) {
    throw new AppError(401, "You can not reset your password");
  }

  const isUserExists = await User.findById(decodedToken.userId);

  if (!isUserExists) {
    throw new AppError(401, "User does not exist!");
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  isUserExists.password = hashedPassword;

  await isUserExists.save();
};

export const AuthServices = {
  getNewAccessToken,
  changePassword,
  setPassword,
  forgotPassword,
  resetPassword,
};
