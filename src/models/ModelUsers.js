import { DataTypes } from "sequelize";
import db from "../configs/Database.js";
import Roles from "./ModelRoles.js";

const Users = db.define(
  "users",
  {
    id_user: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      validate: {
        notEmpty: true,
      },
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.CHAR(20),
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
    },
    role_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
  }
);

Users.belongsTo(Roles, {
  foreignKey: "role_id",
  as: "roles",
  onDelete: "cascade",
});

export default Users;
