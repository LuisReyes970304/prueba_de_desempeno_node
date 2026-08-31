import type { UserRepoInterface } from "./interface/user.repository.interface.ts";
import User from "../models/user.model.ts";
import type { UserCreationDto, UserUpdateDto } from "../dto/user.dto.ts";

/**
 * This class is the user repository.
 * And is the only one how interacts with sequelize methods.
 */
export class UserRepository implements UserRepoInterface {

    /**
     * This method has as objective the creation of a new user.
     * 
     * @param {UserCreationDto} data - Uses the interface DTO for user creation for security purposes. 
     * @returns {User} - Returns the user created.
     */
    async create(data: UserCreationDto): Promise<User> {
        return await User.create(data);
    }

    /**
     * This method has as objetive, finding all the users in the database. 
     * 
     * @returns {User} -Returns all the users in the data abse in a Array.
     */
    async findAll(): Promise<User[]> {
        return User.findAll();
    }

    /**
     * This method has as objetice, find an user in the database.
     * If active is true, is going to look between actives users.
     * If active is false, is going to look between actives and those deleted with soft-delete (This option is usefull for an admin panel)
     * 
     * @param {number} id - Uses the id to find an user in the database
     * @param {boolean} active - Verify if the user has been deleted or not from the database with soft-delete
     * @returns 
     */
    async findOne(id: number, active: boolean): Promise<User | null> {
        return await User.findOne({where: {id}, paranoid: active});
    }

    /**
     * This method looks for an user. 
     * If there is not an user in the database, is going to return null.
     * Otherwise is going to find it and update it.
     * 
     * @param {number} id - Uses the ID of the user to find it.
     * @param {UserUpdateDto} data - Uses the User Update DTO to update the user data in a secure way. 
     * @returns {User | null} - Returns null or the user updated.
     */
    async update(id: number, data: UserUpdateDto): Promise<boolean>{
        const [affectedCount] = await User.update(data, {where: {id}}) ;
        return affectedCount > 0;
    }

    /**
     * This method uses the user ID to delete it, with a soft-delete.
     * 
     * @param {number} id - Uses the user ID to delete it.
     * @returns {number} - returns the number of user deleted.
     */
    async delete(id: number): Promise<boolean> {
    const affectedRow = await User.destroy({where: {id}});
        return affectedRow >0;
    }

    /**
     * This method allows restore an user that has been deleted throu soft-delete
     * 
     * @param {number} id -Uses the ID of the user to restore it.
     * @returns {void} - It returns void.
     */
    async restore(id: number): Promise<void> {
        return await User.restore({where: {id}});
    }
};
