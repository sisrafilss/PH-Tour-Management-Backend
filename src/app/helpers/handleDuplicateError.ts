import { TGenericErrorResponse } from "../interfaces/error.types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const matchedArray = err.message.match(/"([^"]*)"/);
  const duplicateField = matchedArray ? matchedArray[1] : "This field";
  return {
    statusCode: 400,
    message: `${duplicateField} already exists!`,
  };
};
