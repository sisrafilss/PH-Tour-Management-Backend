"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cludinary_config_1 = require("./cludinary.config");
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cludinary_config_1.cloudinaryUpload,
    params: {
        public_id: (req, file) => {
            const fileName = file.originalname
                .toLowerCase()
                .replace(/\s+/g, "-") // empty space remove replace with dash
                .replace(/\./g, "-") // replacd dot (.) with dash
                // eslint-disable-next-line no-useless-escape
                .replace(/[^a-z0-9\-\.]/g, ""); // remove non alpha numeric - !@#$
            const extension = file.originalname.split(".").pop();
            const uniqueFileName = Math.random().toString(36).substring(2) +
                "-" +
                Date.now() +
                "-" +
                fileName +
                "." +
                extension;
            return uniqueFileName;
        },
    },
});
exports.multerUpload = (0, multer_1.default)({ storage: storage });
