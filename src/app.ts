import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import expressSession from "express-session";
import passport from "passport";
import { envVars } from "./app/config/env";
import "./app/config/passport";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/routes";

const app = express();

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.set("trust proxy", 1);
app.use(
  cors({
    origin: envVars.FRONTEND_URL || "http://localhost:3001",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", router);

// app.use("/api/v1/user", UserRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to PH Tour Management System Backend",
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
app.use(globalErrorHandler);

app.use(notFound);

export default app;
