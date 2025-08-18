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
exports.StatsController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const states_service_1 = require("./states.service");
const getUserStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield states_service_1.StatsService.getUserStats();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User stats fetched successfully",
        data: result,
    });
});
const getTourStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield states_service_1.StatsService.getTourStats();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Tour stats fetched successfully",
        data: result,
    });
});
const getBookingStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield states_service_1.StatsService.getBookingStats();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Booking stats fetched successfully",
        data: result,
    });
});
const getPaymentStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield states_service_1.StatsService.getPaymentStats();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Payment stats fetched successfully",
        data: result,
    });
});
exports.StatsController = {
    getUserStats,
    getTourStats,
    getBookingStats,
    getPaymentStats,
};
