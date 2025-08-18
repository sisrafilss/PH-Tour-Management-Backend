"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateError = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const handleDuplicateError = (err) => {
    const matchedArray = err.message.match(/"([^"]*)"/);
    const duplicateField = matchedArray ? matchedArray[1] : "This field";
    return {
        statusCode: 400,
        message: `${duplicateField} already exists!`,
    };
};
exports.handleDuplicateError = handleDuplicateError;
