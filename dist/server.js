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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_redis_1 = require("./app/config/config.redis");
const env_1 = require("./app/config/env");
const superAdmin_1 = require("./app/utils/superAdmin");
let server;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(env_1.envVars.DB_URL);
        console.log("Connected to Database!!");
        server = app_1.default.listen(env_1.envVars.PORT, () => {
            console.log(`Server is listening on port: ${env_1.envVars.PORT}`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, config_redis_1.connectRedis)();
    yield startServer();
    yield (0, superAdmin_1.seedSuperAdmin)();
}))();
// unhandled rejection error handle
process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection Detected ... Server shutting down ...", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// creating unhandled rejection error for testing
// Promise.reject(new Error("I forgot to handle this Promise!"));
// uncaught rejection error handle
process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception Detected ... Server shutting down ...", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// creating uncaught rejection error for testing
// throw new Error("I forgot to handle this error!");
// signal termination sigterm
process.on("SIGTERM", () => {
    console.log("SIGTERM Signal received... Server sutting down ...");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// this will execute when we close the server using Ctrl+C.
process.on("SIGINT", () => {
    console.log("SIGINT Signal received... Server sutting down ...");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
/**
 * unhandled rejection error
 * uncaught rejection error
 * signal termination sigterm
 **/
