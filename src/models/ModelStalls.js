import { DataTypes } from 'sequelize';
import db from '../configs/Database.js';
import Users from './ModelUsers.js';
import StallCategories from './ModelStallCategories.js';

const Stalls = db.define(
  'stalls',
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true,
      },
    },
    name_stall: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name_seller: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.CHAR(20),
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path_img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
    },
    latitude: {
      type: DataTypes.STRING(50),
    },
    longitude: {
      type: DataTypes.STRING(50),
    },
    user_id: {
      type: DataTypes.STRING,
    },
    stall_category_id: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    freezeTableName: true,
  }
);

Stalls.belongsTo(Users, {
  foreignKey: 'user_id',
  as: 'users',
  onDelete: 'cascade',
});
Stalls.belongsTo(StallCategories, {
  foreignKey: 'stall_category_id',
  as: 'stallCategories',
});

export default Stalls;
