import { DataTypes } from 'sequelize';
import db from '../configs/Database.js';
import Users from './ModelUsers.js';

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
    name: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
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

Service.belongsTo(Users, {
  foreignKey: 'created_by',
  as: 'creater',
  onDelete: 'restrict',
  onUpdate: 'restrict',
});
Service.belongsTo(Users, {
  foreignKey: 'updated_by',
  as: 'updater',
  onDelete: 'restrict',
  onUpdate: 'restrict',
});

export default Service;
