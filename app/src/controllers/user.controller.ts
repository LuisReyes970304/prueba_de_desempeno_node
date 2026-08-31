import { UserService } from "../services/users.service.ts";
import type { Response, Request } from "express";

class UserController {
    /**
     * 
     * @param userService - Inject de UserService dependency allowing a best testing in the future.
     */
    constructor(private userService: UserService = new UserService()) {
        this.findAllUsers = this.findAllUsers.bind(this);
        this.createUser = this.createUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.restoreUser = this.restoreUser.bind(this);
    }

    /**
     * Method that create a new user and then return it, so is possible check it.
     */
    createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await this.userService.create(req.body);
            res.status(201).json(user);
        } catch (error) {
            this.handleError(res, error, 400, "Unexpected error creating user");
        }
    };

    /**
     * Method that returns all the users in the database.
     */
    findAllUsers = async (_req: Request, res: Response): Promise<void> => {
        try {
            const users = await this.userService.findAll();
            res.status(200).json(users);
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Method that allows update an user and then return the user updated.
     */
    updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res);
            if (id === null) return;

            const userUpdated = await this.userService.update(id, req.body);
            res.status(200).json(userUpdated); 
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Method that delete an user with soft-delete
     */
    deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res);
            if (id === null) return;

            const userDeleted = await this.userService.delete(id);
            res.status(200).json({ userDeleted }); // ¡Corregido: res.json en lugar de return!
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * 
     */
    restoreUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res);
            if (id === null) return;

            const userRestored = await this.userService.restore(id);
            res.status(200).json(userRestored); 
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * --- This is a helper that allows validate the id ---
     */ 
    private validateId(id: unknown, res: Response): number | null {
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            res.status(400).json({
                error: "Invalid or missing user ID"
            });
            return null;
        }
        return parsedId;
    }

    private handleError(res: Response, error: unknown, defaultStatus: number, defaultMsg = "An unexpected error occurred") {
        const message = error instanceof Error ? error.message : defaultMsg;
        const status = message.includes("not found") ? 404 : defaultStatus;
        res.status(status).json({ error: message });
    }
}

// Exportamos una instancia lista para usar en tus rutas (ej: router.put('/:id', userController.updateUser))
export const userController = new UserController();
