import User from "../models/user.model.ts";
import type { authRepositoryInterface } from "./interface/auth.repository.interface.ts";

export class AuthRepository implements authRepositoryInterface{

    /**
     * This is the repository used to find one user based on its email.
     * 
     * @param {string} email -Uses the user email to find the right account. 
     * @returns {User | null} -If the user exists in database is returned.
     */
    async findOne(email: string): Promise<User | null>  {
        return await User.findOne({where: {email}});
    }
}