/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);
    res
      .status(httpStatus.CREATED)
      .json({ message: "User created successfully!", user });
  }
);

// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const user = await UserServices.createUser(req.body);
//     res
//       .status(httpStatus.CREATED)
//       .json({ message: "User created successfully!", user });
//   } catch (err: any) {
//     // eslint-disable-next-line no-console
//     console.log(err);
//     next(err);

//     // res.status(httpStatus.BAD_REQUEST).json({
//     //   message: `Something went wrong! ${err.message}`,
//     //   err,
//     // });
//   }
// };

//
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();
    // res.status(httpStatus.OK).json({
    //   success: true,
    //   message: "All users retrived successfully!",
    //   data: users,
    // });
    // console.log(users);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All users retrived successfully!",
      data: result.data,
      meta: result.meta,
    });
  }
);

export const UserControllers = {
  createUser,
  getAllUsers,
};
