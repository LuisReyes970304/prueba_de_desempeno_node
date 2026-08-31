import sequelize from "../config/database.ts";
import Warehouse from "./werehouse.model.ts";
import Medication from "./medication.model.ts";
import {
    DataTypes,
    Model,
    type InferAttributes,
    type InferCreationAttributes,
    type CreationOptional,
} from "sequelize";

/**
 * Inventory represents the stock of a given medication in a given
 * warehouse. A medication can be stocked in several warehouses, each
 * with its own quantity, hence this join table between Warehouse and
 * Medication.
 */
class Inventory extends Model<InferAttributes<Inventory>, InferCreationAttributes<Inventory>> {
    declare id: CreationOptional<number>;
    declare warehouseId: number;
    declare medicationId: number;
    declare quantity: number;
}

Inventory.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        warehouseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Warehouse,
                key: "id",
            },
        },
        medicationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Medication,
                key: "id",
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
    },
    {
        sequelize: sequelize,
        timestamps: true,
        modelName: "Inventory",
        paranoid: true,
    }
);

Inventory.belongsTo(Warehouse, { foreignKey: "warehouseId", as: "warehouse" });
Inventory.belongsTo(Medication, { foreignKey: "medicationId", as: "medication" });
Warehouse.hasMany(Inventory, { foreignKey: "warehouseId", as: "inventoryEntries" });
Medication.hasMany(Inventory, { foreignKey: "medicationId", as: "inventoryEntries" });

export default Inventory;
