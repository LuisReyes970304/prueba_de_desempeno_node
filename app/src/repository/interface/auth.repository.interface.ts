import User from "../../models/user.model.ts";

export interface authRepositoryInterface{
    findOne(email: string): Promise<User | null>;
}