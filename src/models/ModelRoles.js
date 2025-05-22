import { DataTypes } from 'sequelize';
import db from '../configs/Database.js';

const Roles = db.define(
  'roles',
  {
    id_role: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role_name: {
      type: DataTypes.STRING,
    },
    role_key: {
      type: DataTypes.ENUM('superadmin', 'admin', 'user'),
    },
  },
  {
    freezeTableName: true,
  }
);

export default Roles;
