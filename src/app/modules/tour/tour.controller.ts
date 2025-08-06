import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TourService } from "./tour.service";

const createTourType = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;
  const result = await TourService.createTourType(name);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour type created successfully!",
    data: result,
  });
});

const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
  const result = await TourService.getAllTourTypes();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All tour types retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const updatedTourType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourService.updateTourType(id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour type updated successfully!",
    data: result,
  });
});

const deleteTourType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourService.deleteTourType(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour type deleted successfully!!",
    data: result,
  });
});

/* ------------------------- TOUR ROUTES ------------------------ */
const createTour = catchAsync(async (req: Request, res: Response) => {
  const result = await TourService.createTour(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour created successfully!",
    data: result,
  });
});

const getAllTours = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await TourService.getAllTours(query as Record<string, string>);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All tour types retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const updatedTour = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourService.updateTour(id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour updated successfully!",
    data: result,
  });
});

const deleteTour = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourService.deleteTour(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour deleted successfully!!",
    data: result,
  });
});

export const TourController = {
  createTourType,
  getAllTourTypes,
  updatedTourType,
  deleteTourType,
  createTour,
  getAllTours,
  updatedTour,
  deleteTour,
};
