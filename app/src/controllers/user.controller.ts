import { UserService } from "../services/users.service.ts";
import type { Response, Request } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.ts";
import { BaseController } from "./base.controller.ts";

class UserController extends BaseController {
    /**
     * 
     * @param userService - Inject de UserService dependency allowing a best testing in the future.
     */
    constructor(private userService: UserService = new UserService()) {
        super();
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
            this.handleError(res, error, 400, { defaultMsg: "Unexpected error creating user" });
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
     * An "user" just can be update itself.
     * An "admin" can update everyone.
     */
    updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res, "user ID");
            if (id === null) return;

            const isSelf = req.user?.id === id;
            const isAdmin = req.user?.role === "admin";
            if (!isSelf && !isAdmin) {
                res.status(403).json({ error: "You can only update your own account" });
                return;
            }

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
            const id = this.validateId(req.params.id, res, "user ID");
            if (id === null) return;

            const userDeleted = await this.userService.delete(id);
            res.status(200).json({ userDeleted }); 
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Restores a soft-deleted user.
     */
    restoreUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res, "user ID");
            if (id === null) return;

            const userRestored = await this.userService.restore(id);
            res.status(200).json(userRestored); 
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };
}

export const userController = new UserController();
