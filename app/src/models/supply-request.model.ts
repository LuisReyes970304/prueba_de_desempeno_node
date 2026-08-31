import sequelize from "../config/database.ts";
import Clinic from "./clinic.model.ts";
import Medication from "./medication.model.ts";
import Warehouse from "./werehouse.model.ts";
import User from "./user.model.ts";
import {
    DataTypes,
    Model,
    type InferAttributes,
    type InferCreationAttributes,
    type CreationOptional,
    type NonAttribute,
} from "sequelize";

/**
 * The set of statuses a supply request can be in. Kept as a plain
 * array (not a DB enum type) so it stays easy to extend without a
 * migration, while still being validated at the application layer.
 */
export const REQUEST_STATUSES = ["pending", "approved", "rejected", "delivered", "cancelled"] as const;
export type RequestStatus = typeof REQUEST_STATUSES[number];

/**
 * SupplyRequest represents a clinic's request to be supplied with a
 * given quantity of a medication, sourced from a specific warehouse.
 * Named "SupplyRequest" (not "Request") to avoid clashing with
 * Express's own Request type.
 */
class SupplyRequest extends Model<
    InferAttributes<SupplyRequest, { omit: "createdAt" | "updatedAt" | "deletedAt" }>,
    InferCreationAttributes<SupplyRequest, { omit: "createdAt" | "updatedAt" | "deletedAt" }>
> {
    declare id: CreationOptional<number>;
    declare clinicId: number;
    declare medicationId: number;
    declare warehouseId: number;
    declare quantity: number;
    declare status: CreationOptional<RequestStatus>;
    declare requestedByUserId: number;

    declare readonly createdAt: CreationOptional<Date>;
    declare readonly updatedAt: CreationOptional<Date>;
    declare readonly deletedAt: CreationOptional<Date | null>;

    /** Present only when the query eager-loads the "clinic" association. */
    declare clinic?: NonAttribute<Clinic>;
    /** Present only when the query eager-loads the "medication" association. */
    declare medication?: NonAttribute<Medication>;
    /** Present only when the query eager-loads the "warehouse" association. */
    declare warehouse?: NonAttribute<Warehouse>;
    /** Present only when the query eager-loads the "requestedBy" association. */
    declare requestedBy?: NonAttribute<User>;
}

SupplyRequest.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        clinicId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Clinic,
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
        warehouseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Warehouse,
                key: "id",
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },
        status: {
            type: DataTypes.ENUM(...REQUEST_STATUSES),
            allowNull: false,
            defaultValue: "pending",
        },
        requestedByUserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
    },
    {
        sequelize: sequelize,
        timestamps: true,
        modelName: "SupplyRequest",
        paranoid: true,
    }
);

SupplyRequest.belongsTo(Clinic, { foreignKey: "clinicId", as: "clinic" });
SupplyRequest.belongsTo(Medication, { foreignKey: "medicationId", as: "medication" });
SupplyRequest.belongsTo(Warehouse, { foreignKey: "warehouseId", as: "warehouse" });
SupplyRequest.belongsTo(User, { foreignKey: "requestedByUserId", as: "requestedBy" });
Clinic.hasMany(SupplyRequest, { foreignKey: "clinicId", as: "supplyRequests" });

export default SupplyRequest;
