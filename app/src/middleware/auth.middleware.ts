import type { Request, Response, NextFunction } from "express";
import { jwtManager } from "../utils/jwt.util.ts";
import type { JwtPayload } from "../dto/auth.dto.ts";

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

/**
 * Middleware that validate the header "Authorization: Bearer <token>".
 * If the token is valid, it adds the payload decodificated to req.user
 * And lest continue the request, otherwise, it returns 401 error.
 */
export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        res.status(401).json({error: "Missing or invalid authorization"});
        return;
    }
    const token = authHeader.split(" ")[1];
    if(!token){
        res.status(401).json({error: "Missing or invalid authorization"});
        return;
    }
    try {
        req.user = jwtManager.verifyToken(token);
        next();
    } catch(error){
        res.status(401).json({error: "Invalid or expired token"})
    }
}

export function authorizeRoles(...allowedRoles: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            res.status(403).json({ error: "You do not have permission to perform this action" });
            return;
        }
        next();
    };
}