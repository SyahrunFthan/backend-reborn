import { DataTypes } from 'sequelize';
import db from '../configs/Database.js';
import Region from './ModelRegion.js';

const CitizensAssocation = db.define(
  'rt_rw',
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
    region_id: {
      type: DataTypes.STRING,
    },
    rt_number: {
      type: DataTypes.INTEGER,
    },
    rw_number: {
      type: DataTypes.INTEGER,
    },
    rt_leader: {
      type: DataTypes.STRING,
    },
    rw_leader: {
      type: DataTypes.STRING,
    },
    total_kk: {
      type: DataTypes.INTEGER,
    },
    total_population: {
      type: DataTypes.INTEGER,
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

CitizensAssocation.belongsTo(Region, {
  foreignKey: 'region_id',
  as: 'region',
  onDelete: 'cascade',
});

export default CitizensAssocation;
