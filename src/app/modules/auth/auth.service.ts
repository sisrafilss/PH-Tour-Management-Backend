import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { generateToken } from "../../utils/jwt";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExists = await User.findOne({ email });
  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
  }

  const isPasswordMatched = await bcrypt.compare(
    password as string,
    isUserExists.password as string
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
  }

  const jwtPayload = {
    userId: isUserExists._id,
    email: isUserExists.email,
    role: isUserExists.role,
  };

  //   const accessToken = jwt.sign(jwtPayload, "secret", {
  //     expiresIn: "1d",
  //   });

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return {
    accessToken,
  };
};

export const AuthServices = {
  credentialsLogin,
};
