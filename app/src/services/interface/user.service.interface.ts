import User from "../../models/user.model.ts";
import type { UserCreationDto, UserUpdateDto } from "../../dto/user.dto.ts";

/**
 * This is the interface for the user serivce class.
 */
export interface UserServiceInterface {
    create(data: UserCreationDto): Promise<User>;

    findAll(): Promise<User[]>;

    update(id: number, data: UserUpdateDto): Promise<User>;

    delete(id: number): Promise<boolean>;

    restore(id: number): Promise<User> ; 
}
