/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { deleteImageFromCloudinary } from "../config/cludinary.config";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { handleCastError } from "../helpers/handleCastError";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleValidationError } from "../helpers/handleValidationError";
import { handleZodError } from "../helpers/handleZodError";
import { TErrorSources } from "../interfaces/error.types";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,

  next: NextFunction
) => {
  let statusCode = 500;
  let message = `Something went wrong!!`;
  let errorSources: TErrorSources[] = [];

  if (envVars.NODE_ENV === "development") {
    console.log(err);
    if (req.file) {
      await deleteImageFromCloudinary(req.file.path);
    }
    if (req.files && Array.isArray(req.files) && req.files.length) {
      const imgUrls = (req.files as Express.Multer.File[]).map(
        (file) => file.path
      );
      await Promise.all(imgUrls.map((url) => deleteImageFromCloudinary(url)));
    }
  }

  // Duplicate error
  if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Object Id Error / Cast Error
  else if (err.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Zod Error
  else if (err.name === "ZodError") {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TErrorSources[];
  }

  // Mongoose validation error
  else if (err.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TErrorSources[];
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
