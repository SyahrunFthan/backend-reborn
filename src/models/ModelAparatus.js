import { DataTypes } from 'sequelize';
import db from '../configs/Database.js';
import Users from './ModelUsers.js';

const Aparatus = db.define(
  'village_aparatus',
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
    nik: {
      type: DataTypes.CHAR(20),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    place_birth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status_married: {
      type: DataTypes.ENUM('Belum Menikah', 'Menikah'),
      allowNull: false,
    },
    task: {
      type: DataTypes.STRING,
    },
    position: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.TEXT,
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

Aparatus.belongsTo(Users, {
  foreignKey: 'created_by',
  as: 'creator',
  onDelete: 'restrict',
});
Aparatus.belongsTo(Users, {
  foreignKey: 'updated_by',
  as: 'updater',
  onDelete: 'restrict',
});

export default Aparatus;
