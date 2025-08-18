import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { OTPController } from "./otp.controller";
import { sendOTPZodSchema, verifyOTPZodSchema } from "./otp.validation";

const router = Router();

router.post("/send", validateRequest(sendOTPZodSchema), OTPController.sendOTP);
router.post(
  "/verify",
  validateRequest(verifyOTPZodSchema),
  OTPController.verifyOTP
);

export const OtpRoutes = router;
