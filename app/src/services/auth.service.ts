import { AuthRepository } from "../repository/auth.repository.ts";
import type { AuthServiceInterface } from "./interface/auth.service.interface.ts";
import type { LoginDto, AuthResponseDto } from "../dto/auth.dto.ts";
import { passwordManager } from "../utils/bcrypt.util.ts";
import { jwtManager } from "../utils/jwt.util.ts";

const authRepo = new AuthRepository();

export class AuthService implements AuthServiceInterface {

    /**
     * It validate the credentials (email + password) and if they are right.
     * Returns a JWT with the public data.
     * 
     * @param {LoginDto} data - Login session with email and password.
     * @returns {Promise<AuthResponseDto>} - Token + public user data.
     */
    async login(data: LoginDto): Promise <AuthResponseDto> {
        if(!data?.email || !data.password) {
            throw new Error("email and password are required")
        }
        const user = await authRepo.findOne(data.email);
        if(!user) {
            throw new Error("Invalid email or password");
        }
        const validPassword = await passwordManager.passwordVerfier(
            data.password,
            user.password
        );
        if(!validPassword) {
            throw new Error("Invalid email or password");
        }
        const token = jwtManager.generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });
        return{
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
    }
}