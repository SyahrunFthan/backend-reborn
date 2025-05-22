import { DataTypes } from 'sequelize';
import db from '../configs/Database.js';
import Users from './ModelUsers.js';

const News = db.define(
  'news',
  {
    uuid: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
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
  },
  {
    freezeTableName: true,
  }
);

News.belongsTo(Users, {
  foreignKey: 'created_by',
  as: 'users',
  onDelete: 'cascade',
});

export default News;
