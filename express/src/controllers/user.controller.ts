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
            throw error;
        }
    }

    async login(req: Request, res: Response){
        /*
        recibir usuario y contraseña
        buscar que exista el usuario
        comparar las contraseñas (vieja y la actual)
        generar un token en caso de login exitoso. 
        */
       try{
            const user:UserDocument | null = await userService.findByEmail(req.body.email);
            if(!user){
                res.status(400).json({ message: `user ${req.body.email} not found.`});
                return;
            }
            const isMatch = await securityService.comparePasswords(req.body.password, user.password);

            if(!isMatch){
                res.status(400).json({
                    message: `User or password incorrect`
                });
                return;
            }
            const token = await securityService.generateToken(user.id, user.email, user.role);
            res.status(200).json({
                message: "login successfull",
                token: token
            })
            return;

       }catch(error){
        res.status(500).json({
            message: "Login incorrect"
        })
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
            res.status(500).json({message: `The user ${req.body.email} cannot be updated.`})
            return;
        }
    }

}
export const userController = new UserController();