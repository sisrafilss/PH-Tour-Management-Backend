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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const booking_model_1 = require("../booking/booking.model");
const payment_interface_1 = require("../payment/payment.interface");
const payment_model_1 = require("../payment/payment.model");
const tour_model_1 = require("../tour/tour.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const getUserStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsersPromise = user_model_1.User.countDocuments();
    const totalActiveUserPromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.IsActive.ACTIVE,
    });
    const totalBlockedUserPromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.IsActive.ACTIVE,
    });
    const newUsersInLast7DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    const newUsersInLast30DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    const userByRolePromise = user_model_1.User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 },
            },
        },
    ]);
    const [totalUsers, totalActiveUsers, totalBlockedUsers, newUsersInLast7Days, newUsersInLast30Days, userByRole,] = yield Promise.all([
        totalUsersPromise,
        totalActiveUserPromise,
        totalBlockedUserPromise,
        newUsersInLast7DaysPromise,
        newUsersInLast30DaysPromise,
        userByRolePromise,
    ]);
    return {
        totalUsers,
        totalActiveUsers,
        totalBlockedUsers,
        newUsersInLast7Days,
        newUsersInLast30Days,
        userByRole,
    };
});
const getTourStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalTourPromise = tour_model_1.Tour.countDocuments();
    const totalTourByTourTypePromise = tour_model_1.Tour.aggregate([
        // stage-1 : connect Tour Type model - lookup stage
        {
            $lookup: {
                from: "tourtypes",
                localField: "tourType",
                foreignField: "_id",
                as: "type",
            },
        },
        //stage - 2 : unwind the array to object
        {
            $unwind: "$type",
        },
        // state - 3 : grouping tour type
        {
            $group: {
                _id: "$type.name",
                count: { $sum: 1 },
            },
        },
    ]);
    const averageTourCostPromise = tour_model_1.Tour.aggregate([
        // Stage-1 : group the cost from, do sum, and average the sum
        {
            $group: {
                _id: null,
                avgCostFrom: { $avg: "$costFrom" },
            },
        },
    ]);
    const totalTourByDivisionPromise = tour_model_1.Tour.aggregate([
        // stage-1 : connect Division model - lookup stage
        {
            $lookup: {
                from: "divisions",
                localField: "division",
                foreignField: "_id",
                as: "division",
            },
        },
        //stage - 2 : unwind the array to object
        {
            $unwind: "$division",
        },
        //stage - 3 : grouping tour type
        {
            $group: {
                _id: "$division.name",
                count: { $sum: 1 },
            },
        },
    ]);
    const totalHighestBookedTourPromise = booking_model_1.Booking.aggregate([
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 },
            },
        },
        {
            $sort: { bookingCount: -1 },
        },
        { $limit: 5 },
        {
            $lookup: {
                from: "tours",
                let: { tourId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$tourId"] },
                        },
                    },
                ],
                as: "tour",
            },
        },
        { $unwind: "$tour" },
        {
            $project: {
                bookingCount: 1,
                "tour.title": 1,
                "tour.slug": 1,
            },
        },
    ]);
    const [totalTour, totalTourByTourType, averageTourCost, totalTourByDivision, totalHighestBookedTour,] = yield Promise.all([
        totalTourPromise,
        totalTourByTourTypePromise,
        averageTourCostPromise,
        totalTourByDivisionPromise,
        totalHighestBookedTourPromise,
    ]);
    return {
        totalTour,
        totalTourByTourType,
        averageTourCost,
        totalTourByDivision,
        totalHighestBookedTour,
    };
});
const getBookingStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalBookingPromise = booking_model_1.Booking.countDocuments();
    const totalBookingByStatusPromise = booking_model_1.Booking.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    const bookinsgPerTourPromise = booking_model_1.Booking.aggregate([
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 },
            },
        },
        {
            $lookup: {
                from: "tours",
                localField: "_id",
                foreignField: "_id",
                as: "tour",
            },
        },
        { $unwind: "$tour" },
        {
            $sort: { bookingCount: -1 },
        },
        { $limit: 10 },
        { $project: { bookingCount: 1, _id: 1, "tour.title": 1, "tour.slug": 1 } },
    ]);
    const avgGuestCountPerBookingPromise = booking_model_1.Booking.aggregate([
        {
            $group: {
                _id: null,
                avgGuestCount: { $avg: "$guestCount" },
            },
        },
    ]);
    const bookingsLast7DaysPromise = booking_model_1.Booking.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    const bookingsLast30DaysPromise = booking_model_1.Booking.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    const totalBookingByUniqueUersPromise = booking_model_1.Booking.distinct("user").then((user) => user.length);
    const [totalBooking, totalBookingByStatus, bookinsgPerTour, avgGuestCountPerBooking, bookingsLast7Days, bookingsLast30Days, totalBookingByUniqueUers,] = yield Promise.all([
        totalBookingPromise,
        totalBookingByStatusPromise,
        bookinsgPerTourPromise,
        avgGuestCountPerBookingPromise,
        bookingsLast7DaysPromise,
        bookingsLast30DaysPromise,
        totalBookingByUniqueUersPromise,
    ]);
    return {
        totalBooking,
        totalBookingByStatus,
        bookinsgPerTour,
        avgGuestCountPerBooking: avgGuestCountPerBooking[0].avgGuestCount,
        bookingsLast7Days,
        bookingsLast30Days,
        totalBookingByUniqueUers,
    };
});
const getPaymentStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalPaymentPromise = payment_model_1.Payment.countDocuments();
    const totalPaymentByStatusPromise = payment_model_1.Payment.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    const totalRevenuePromise = payment_model_1.Payment.aggregate([
        {
            $match: { status: payment_interface_1.PAYMENT_STATUS.PAID },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$amount" },
            },
        },
    ]);
    const avgPaymentAmountPromise = payment_model_1.Payment.aggregate([
        {
            $group: {
                _id: null,
                avgPaymentAmount: { $avg: "$amount" },
            },
        },
    ]);
    const paymentGatewayDataPromise = payment_model_1.Payment.aggregate([
        //stage 1 group stage
        {
            $group: {
                _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
                count: { $sum: 1 },
            },
        },
    ]);
    const [totalPayment, totalPaymentByStatus, totalRevenue, avgPaymentAmount, paymentGatewayData,] = yield Promise.all([
        totalPaymentPromise,
        totalPaymentByStatusPromise,
        totalRevenuePromise,
        avgPaymentAmountPromise,
        paymentGatewayDataPromise,
    ]);
    return {
        totalPayment,
        totalPaymentByStatus,
        totalRevenue,
        avgPaymentAmount,
        paymentGatewayData,
    };
});
exports.StatsService = {
    getUserStats,
    getTourStats,
    getBookingStats,
    getPaymentStats,
};
