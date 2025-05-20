import { DataTypes } from "sequelize";
import db from "../configs/Database.js";
import Users from "./ModelUsers.js";

const UpcommingMails = db.define(
  "upcoming_mails",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    reference_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_latter: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    objective: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regarding: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
    },
    letter_file: {
      type: DataTypes.STRING,
    },
    path_file: {
      type: DataTypes.STRING,
    },
    created_by: {
      type: DataTypes.STRING,
    },
    updated_by: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

UpcommingMails.belongsTo(Users, {
  as: "creator",
  foreignKey: "created_by",
  onDelete: "restrict",
});
UpcommingMails.belongsTo(Users, {
  as: "updater",
  foreignKey: "updated_by",
  onDelete: "restrict",
});

export default UpcommingMails;
