import { DataTypes } from "sequelize";
import db from "../configs/Database.js";

const ModelResidents = db.define(
  "residents",
  {
    uuid: {
        type: DataTypes.STRING,
        primaryKey: true,
        autoIncrement: true,
    },
    nik: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    no_kk: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    place_birth: {
        type: DataTypes.STRING,
    },
    date_birth: {
        type: DataTypes.DATE,
    },
    gender: {
        type: DataTypes.ENUM('L', 'P'),
    },
    status: {
        type: DataTypes.STRING,
    },
    religion: {
        type: DataTypes.STRING,
    },
    education: {
        type: DataTypes.STRING,
    },
    work: {
        type: DataTypes.STRING,
    },
    age: {
        type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
  }
);

export default ModelResidents;
