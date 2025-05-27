import { DataTypes } from 'sequelize';
import db from '../configs/Database.js';
import Users from './ModelUsers.js';
import Service from './ModelServices.js';

const ServiceDetail = db.define(
  'service_details',
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
      allowNull: false,
    },
    file: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path_file: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    service_id: {
      type: DataTypes.STRING,
      allowNull: false,
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

ServiceDetail.belongsTo(Users, {
  foreignKey: 'created_by',
  as: 'creater',
  onDelete: 'restrict',
  onUpdate: 'restrict',
});
ServiceDetail.belongsTo(Users, {
  foreignKey: 'updated_by',
  as: 'updater',
  onDelete: 'restrict',
  onUpdate: 'restrict',
});
ServiceDetail.belongsTo(Service, {
  foreignKey: 'service_id',
  as: 'services',
  onDelete: 'restrict',
  onUpdate: 'restrict',
});

export default ServiceDetail;
