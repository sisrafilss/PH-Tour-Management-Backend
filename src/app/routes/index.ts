import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { DivisionRoutes } from "../modules/division/division.route";

import { bookingRoutes } from "../modules/booking/booking.route";

import { PaymentRoutes } from "../modules/payment/payment.route";
import { TourRoutes } from "../modules/tour/tour.route";
import { UserRoutes } from "../modules/user/user.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/division",
    route: DivisionRoutes,
  },
  {
    path: "/tour",
    route: TourRoutes,
  },
  {
    path: "/booking",
    route: bookingRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
