import type { LoginDto, AuthResponseDto } from "../../dto/auth.dto.ts";

/**
 * This is the interface for the auth service class.
 */
export interface AuthServiceInterface {
    login(data: LoginDto): Promise<AuthResponseDto>;
}
