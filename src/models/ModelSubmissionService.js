import { DataTypes } from 'sequelize';
import db from '../configs/Database.js';
import Service from './ModelServices.js';

const SubmissionService = db.define(
  'submission_services',
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
    service_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nik: {
      type: DataTypes.CHAR(20),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path_file: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_signed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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

SubmissionService.belongsTo(Service, {
  foreignKey: 'service_id',
  as: 'service',
  onDelete: 'restrict',
  onUpdate: 'restrict',
});

export default SubmissionService;
