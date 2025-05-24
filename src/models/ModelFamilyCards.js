import { DataTypes } from 'sequelize';
import db from '../configs/Database.js';
import Users from './ModelUsers.js';

const FamilyCard = db.define(
  'family_cards',
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
    family_card_number: {
      type: DataTypes.INTEGER(20),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nik: {
      type: DataTypes.INTEGER(20),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Kepala Keluarga', 'Anggota Keluarga'),
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

FamilyCard.belongsTo(Users, {
  foreignKey: 'created_by',
  as: 'creator',
  onDelete: 'restrict',
  onUpdate: 'restrict',
});
FamilyCard.belongsTo(Users, {
  foreignKey: 'updated_by',
  as: 'updater',
  onDelete: 'restrict',
  onUpdate: 'restrict',
});

export default FamilyCard;
