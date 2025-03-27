import { Router } from "express";
import { authController } from "../controllers";

export const userRouter = Router();

userRouter.post("/login", authController.login);
