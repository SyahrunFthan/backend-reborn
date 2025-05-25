import { json } from 'sequelize';
import FamilyCard from '../models/ModelFamilyCards.js';

export const createFamilyCard = async (req, res) => {
  const { family_card_number, name, nik, status } = req.body;
  const { id } = req.params;

  try {
    await FamilyCard.create({
      family_card_number,
      name,
      nik,
      status,
      created_by: id,
    });

    return res
      .status(201)
      .json({ message: 'berhasil menambahkan kartu keluarga' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const updateFamilyCard = async (req, res) => {
  const { family_card_number, name, nik, status } = req.body;
  const { id, id_user } = req.params;

  const familyCard = await FamilyCard.findByPk(id);
  try {
    await familyCard.update({
      family_card_number,
      name,
      nik,
      status,
      updated_by: id_user,
    });

    return res
      .status(200)
      .json({ message: 'Berhasil mengubah data family card' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const deleteFamilyCard = async (req, res) => {
  try {
    const { id } = req.params;

    const familyCard = await FamilyCard.findByPk(id);

    await familyCard.destroy();

    return res.status(200).json({ message: 'Berhasil menghapus family card' });
  } catch (error) {}
};
