import User from "../models/user.model.ts";
import type { UserCreationDto, UserUpdateDto } from "../dto/user.dto.ts";
import { UserRepository } from "../repository/user.repository.ts";
import type { UserServiceInterface } from "./interface/user.service.interface.ts";
import {passwordManager} from "../utils/bcrypt.util.ts";

const userRepository = new UserRepository();

export class UserService implements UserServiceInterface {
    async create(data: UserCreationDto): Promise<User> {
        if (!data) {
        throw new Error("name and password are required");
        }
        data.password = await passwordManager.passwordHasher(data.password);
        return await userRepository.create(data);
    }

    async findAll(): Promise<User[]> {
        const usersList = await userRepository.findAll();
        return usersList;
    }

    async update(id: number, data: UserUpdateDto): Promise<User> {
        const affectedCount = await userRepository.update(id, data);
        if (!affectedCount) {
        throw new Error("Not user found");
        }
        const userUpdated = await userRepository.findOne(id, true);
        if (!userUpdated) {
        throw new Error("User was updated but could not be retrived");
        }
        return userUpdated;
    }

    async delete(id: number): Promise<boolean> {
        const userDeleted = await userRepository.delete(id);
        if (!userDeleted) {
        throw new Error("User not found or already deleted");
        }
        return userDeleted;
    }

    async restore(id: number): Promise<User> {
        const user = await userRepository.findOne(id, false);
        if (!user) {
        throw new Error("User not found");
        }
        await userRepository.restore(id);
        return user;
    }
}

