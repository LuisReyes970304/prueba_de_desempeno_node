import sequelize from "../config/database.ts";
import {
    DataTypes,
    Model,
    type InferAttributes,
    type InferCreationAttributes,
    type CreationOptional,
} from "sequelize";

class Medication extends Model<InferAttributes<Medication>, InferCreationAttributes<Medication>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare description: string;
    declare unit: string;
}

Medication.init(
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
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        unit: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelize,
        timestamps: true,
        modelName: "Medication",
        paranoid: true,
    }
);

export default Medication;
