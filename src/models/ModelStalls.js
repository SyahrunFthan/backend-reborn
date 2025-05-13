import { DataTypes } from "sequelize";
import db from "../configs/Database.js";
import Users from "./ModelUsers.js";
import StallCategories from "./ModelStallCategories.js";

const Stalls = db.define(
  "stalls",
  {
    id_stall: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true,
      },
    },
    name_stall: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
    },
    user_id: {
      type: DataTypes.STRING,
    },
    stall_category_id: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

Stalls.belongsTo(Users, {
  foreignKey: "user_id",
  as: "users",
  onDelete: "cascade",
});
Stalls.belongsTo(StallCategories, {
  foreignKey: "stall_category_id",
  as: "stallCategories",
});

export default Stalls;
