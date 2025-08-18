import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { StatsService } from "./states.service";

const getUserStats = async (req: Request, res: Response) => {
  const result = await StatsService.getUserStats();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User stats fetched successfully",
    data: result,
  });
};

const getTourStats = async (req: Request, res: Response) => {
  const result = await StatsService.getTourStats();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Tour stats fetched successfully",
    data: result,
  });
};

const getBookingStats = async (req: Request, res: Response) => {
  const result = await StatsService.getBookingStats();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Booking stats fetched successfully",
    data: result,
  });
};
const getPaymentStats = async (req: Request, res: Response) => {
  const result = await StatsService.getPaymentStats();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Payment stats fetched successfully",
    data: result,
  });
};

export const StatsController = {
  getUserStats,
  getTourStats,
  getBookingStats,
  getPaymentStats,
};
