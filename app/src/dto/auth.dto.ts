
/**
 * Data delivered in the POST body /auth/login
 */
export interface LoginDto {
    email: string;
    password: string;
}

/**
 * data that will be signed in the JWT.
 * It doesn't includes password because this is a sensitive data.
 */
export interface JwtPayload {
    id: number;
    email: string;
    role: string;
}

/**
 * Response that returns the login: token + public user information.
 */
export interface AuthResponseDto {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
}
