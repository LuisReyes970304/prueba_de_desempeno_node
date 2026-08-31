import sequelize from "../config/database.ts";
import {
    DataTypes,
    Model,
    type InferAttributes,
    type InferCreationAttributes,
    type CreationOptional,
} from "sequelize";

class Clinic extends Model<InferAttributes<Clinic>, InferCreationAttributes<Clinic>>{
    declare id: CreationOptional<number>;
    declare name: string;
    declare nit: number;
    declare phone: number;
    declare address: string;
    declare responsibleName: string;
}

Clinic.init(
    {
        id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        },
        name: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        nit: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true
        },
        phone: {
        type: DataTypes.BIGINT,
        allowNull: false,
        },
        address: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        responsibleName: {
        type: DataTypes.STRING,
        allowNull: false,
        }
    },
    {
        sequelize: sequelize, 
        timestamps: true,
        modelName: "Clinic",
        paranoid: true,
    },
);

export default Clinic;