import { Request, Response } from "express";
import { securityService, userService } from "../services";
import { UserDocument, UserInput } from "../models";

class UserController{

    async create(req: Request, res: Response){
        try{
            const userExist : UserDocument | null = await userService.findByEmail(req.body.email);
            if(userExist){
                res.status(400).json({message: `the user ${req.body.email} already exist!`});
                return;
            }
            req.body.password = await securityService.encryptPassword(req.body.password);
            const user: UserDocument = await userService.create(req.body);
            res.status(201).json(user);
            return;

        }catch(error){
            res.status(500).json(`the user hasn't been created`)
            return;
        }
    }

    async findAll(req: Request, res: Response){
        try{
            const users: UserDocument[] = await userService.getAll();
            res.json(users);
            return;
        }catch(error){
            console.log(error);
            res.status(500).json(`cannot get the users`)
            return;
        }
    }


    async update(req: Request, res: Response){
        try{
            const email: string = req.params.email;
            const user: UserDocument | null = await userService.updateUser(email, req.body as UserInput);
            if(user === null){
                res.status(404).json({message: `User ${email} not found.`})
                return;
            }
            res.json(user);
            return;
        }catch(error){
            res.status(500).json({message: `The user ${req.params.email} cannot be updated.`})
            return;
        }
    }

}
export const userController = new UserController();