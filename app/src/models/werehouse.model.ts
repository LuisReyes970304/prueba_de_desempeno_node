import sequelize from "../config/database.ts";
import {
    DataTypes,
    Model,
    type InferAttributes,
    type InferCreationAttributes,
    type CreationOptional,
} from "sequelize";

class Warehouse extends Model<InferAttributes<Warehouse>, InferCreationAttributes<Warehouse>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare location: string;
    declare phone: number;
}

Warehouse.init(
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
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
    },
    {
        sequelize: sequelize,
        timestamps: true,
        modelName: "Warehouse",
        paranoid: true,
    }
);

export default Warehouse;