import { DataTypes } from 'sequelize';
import db from '../configs/Database.js';
import CitizensAssocation from './ModelCitizensAssocation.js';
import Region from './ModelRegion.js';

const Residents = db.define(
  'residents',
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
    nik: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    no_kk: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    place_birth: {
      type: DataTypes.STRING,
    },
    date_birth: {
      type: DataTypes.DATE,
    },
    gender: {
      type: DataTypes.ENUM('L', 'P'),
    },
    status_married: {
      type: DataTypes.ENUM('menikah', 'belum menikah'),
    },
    religion: {
      type: DataTypes.STRING,
    },
    education: {
      type: DataTypes.STRING,
    },
    work: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    citizen_status: {
      type: DataTypes.STRING, // Migrasi, Mutasi, Penduduk Lokal
    },
    rt_rw_id: {
      type: DataTypes.STRING,
    },
    region_id: {
      type: DataTypes.STRING,
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

Residents.belongsTo(CitizensAssocation, {
  foreignKey: 'rt_rw_id',
  as: 'citizensAsociation',
  onDelete: 'restrict',
});
Residents.belongsTo(Region, {
  foreignKey: 'region_id',
  as: 'region',
  onDelete: 'restrict',
});

export default Residents;
