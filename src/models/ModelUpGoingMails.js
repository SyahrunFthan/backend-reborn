import { DataTypes } from 'sequelize';
import db from '../configs/Database.js';
import Users from './ModelUsers.js';

const UpGoingMail = db.define(
  'up_going_mails',
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
    status_latter: {
      type: DataTypes.ENUM('Draft', 'Terkirim', 'Dalam Proses'),
      defaultValue: 'Draft',
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

export default UpGoingMail;
