import { DataTypes } from 'sequelize';
import db from '../configs/Database.js';

const Service = db.define(
  'services',
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
    title: {
      type: DataTypes.STRING,
    },
    file: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path_file: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    type_service: {
      type: DataTypes.ENUM(
        'umum',
        'penduduk',
        'pernikahan',
        'pertanahan',
        'lainnya'
      ),
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Service;
