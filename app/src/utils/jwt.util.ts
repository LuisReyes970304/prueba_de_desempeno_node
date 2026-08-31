import jwt, { type SignOptions} from "jsonwebtoken";
import "dotenv/config";
import type { JwtPayload } from "../dto/auth.dto.ts";

const JWT_SCRET: string = process.env.JWT_SECRET ?? "";
const JWT_EXPIRES_IN: NonNullable<SignOptions["expiresIn"]> = (process.env.
    JWT_EXPIRES_IN ?? "1h") as NonNullable<SignOptions["expiresIn"]>;

class JwtManager {

    generateToken(paylaod: JwtPayload): string {
        if(!JWT_SCRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const options: SignOptions = {expiresIn: JWT_EXPIRES_IN};
        return jwt.sign(paylaod, JWT_SCRET, options);
    }

    verifyToken(token: string): JwtPayload {
        if(!JWT_SCRET){
            throw new Error("JWT_SECRET is not denifed");
        }
        return jwt.verify(token, JWT_SCRET) as JwtPayload
    }
}

export const jwtManager = new JwtManager();