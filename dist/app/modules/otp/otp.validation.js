"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTPZodSchema = exports.sendOTPZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.sendOTPZodSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
});
exports.verifyOTPZodSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    otp: zod_1.default.string(),
});
