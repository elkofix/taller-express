import { Request, Response } from "express";
import { securityService, userService } from "../services";
import { UserDocument, UserInput } from "../models";

class AuthController{

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
}
export const authController = new AuthController();