import { UserDocument, UserInput, UserModel } from '../models/user.model';
class UserService{

    async create(data: UserDocument){
        try{
            const user = await UserModel.create(data);
            return user;
        }catch(error){
            throw error;
        }
    }

    async findByEmail(email:string){
        try{
            const user = await UserModel.findOne({ email : email});
            return user;
        }catch(error){
            throw error;
        }
    }

    async getAll():Promise<UserDocument[]>{
        try{
            const users: UserDocument[] = await UserModel.find({ isActive: true });
            return users;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async updateUser(email:string, student: UserInput){
        try{
            const updatedUser: UserDocument | null = await UserModel.findOneAndUpdate( { email: email}, student, {returnOriginal: false} );
            if(updatedUser){
                updatedUser.password = "";
            }
            return updatedUser;
        }catch(error){
            throw error;
        }
    }

    async deleteUser(email: string): Promise<UserDocument | null> {
        try {
            const updatedUser: UserDocument | null = await UserModel.findOneAndUpdate(
                { email: email },
                { isActive: false },
                { returnOriginal: false }
            );
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }
    

}
export const userService = new UserService();