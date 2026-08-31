import { Sequelize } from "sequelize";
import "dotenv/config";
// import { database } from "../models/user.model.ts";

export const port: Number = parseInt(process.env.SERVER_PORT as string, 10);
export const host: String = process.env.SERVER_URL as string; 

const sequelize = new Sequelize(
    process.env.POSTGRES_DB as string,
    process.env.POSTGRES_USER as string,
    process.env.POSTGRES_PASSWORD as string,
    {
        host: process.env.POSTGRES_HOST as string,
        port: parseInt(process.env.POSTGRES_PORT as string, 10),
        dialect: "postgres",
        logging: false,
    } 
);

export default sequelize  