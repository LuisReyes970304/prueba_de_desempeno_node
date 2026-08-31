import { AuthService } from "../services/auth.service.ts";
import type {Response, Request } from "express";

class AuthController {
    /**
     * 
     * @param authService - Inject de AuthService dependency allowing a best testing in the future.
     */
    constructor(private authService: AuthService = new AuthService){
        this.login = this.login.bind(this);
    }

    /**
     * Method that validates credentials and returns a JWT + user info.
     */
    async login(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.authService.login(req.body);
            res.status(200).json(result);
        } catch(error){
            this.handleError(res, error, 400, "Unexpected error logging in")
        }
    }

    /**
     * - Private method to handle error and make cleaner the code.
     */
    private handleError(res: Response, error: unknown, defaultStatus: number, defaultMsg = "An unexpected error occurred") {
        const message = error instanceof Error ? error.message : defaultMsg;
        const status = message === "Invalid email or password" ? 401 : defaultStatus;
        res.status(status).json({ error: message });
    }
}

export const authController = new AuthController();