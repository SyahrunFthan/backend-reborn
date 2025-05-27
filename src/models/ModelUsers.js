import { DataTypes } from 'sequelize';
import db from '../configs/Database.js';
import Roles from './ModelRoles.js';
import Residents from './ModelResidents.js';

const Users = db.define(
  'users',
  {
    uuid: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
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
    resident_id: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

Users.belongsTo(Roles, {
  foreignKey: 'role_id',
  as: 'roles',
  onDelete: 'restrict',
});
Users.belongsTo(Residents, {
  foreignKey: 'resident_id',
  as: 'resident',
  onDelete: 'restrict',
});

export default Users;
