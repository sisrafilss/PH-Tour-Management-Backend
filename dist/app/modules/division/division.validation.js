"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDivisionSchema = exports.createDivisionSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createDivisionSchema = zod_1.default.object({
    name: zod_1.default.string().min(1),
    thumbnail: zod_1.default.string().optional(),
    description: zod_1.default.string().optional(),
});
exports.updateDivisionSchema = zod_1.default.object({
    name: zod_1.default.string().min(1).optional(),
    thumbnail: zod_1.default.string().optional(),
    description: zod_1.default.string().optional(),
});
