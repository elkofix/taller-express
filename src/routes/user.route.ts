import { Router } from "express";
import { userController } from "../controllers";
import { auth, authorizeRoles } from "../middlewares/auth.middleware";

export const userRouter = Router();

userRouter.get("/", userController.findAll);
userRouter.post("/", auth, authorizeRoles(['superadmin']) ,userController.create);
userRouter.put("/:email", auth, authorizeRoles(['superadmin']), userController.update);
userRouter.delete('/:email',auth, authorizeRoles(['superadmin']), userController.delete);

