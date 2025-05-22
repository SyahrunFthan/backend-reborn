import { DataTypes } from 'sequelize';
import db from '../configs/Database.js';

const VillageApparatus = db.define(
  'village_apparatus',
  {
    uuid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nik: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
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
    address: {
      type: DataTypes.TEXT,
    },
    phone_number: {
      type: DataTypes.CHAR(20),
    },
    position: {
      type: DataTypes.STRING,
    },
    img: {
      type: DataTypes.STRING,
    },
    path_img: {
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

export default VillageApparatus;
