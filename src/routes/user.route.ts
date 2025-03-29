import { Router } from "express";
import { userController } from "../controllers";
import { auth, authorizeRoles } from "../middlewares/auth.middleware";

export const userRouter = Router();

userRouter.get("/", userController.findAll);
userRouter.post("/",userController.create);
userRouter.put("/:email", userController.update);
