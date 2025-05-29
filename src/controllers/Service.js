import { title } from 'process';
import Service from '../models/ModelServices.js';
import path from 'path';

//  User
export const getService = async (req, res) => {
  try {
    const response = await Service.findAll({
      attributes: [
        'uuid',
        'name',
        'status',
        'name_concerned',
        'file',
        'path_file',
      ],
    });

    return res.status(200).json({ response });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// user
export const getServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Service.findByPk(id, {
      attributes: [
        'uuid',
        'name',
        'status',
        'name_concerned',
        'file',
        'path_file',
      ],
    });

    return res.status(200).json({ response });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// user
export const createService = async (req, res) => {
  const { title, type_service } = req.body;
  const { name } = req;

  try {
    await Service.create({
      type_service,
      title,
      created_by: name,
    });

    return res.status(201).json({ message: 'berhasil menambahkan service' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Admin
export const updateService = async (req, res) => {
  const { title, status, type_service } = req.body;
  const { name } = req;
  const { id } = req.params;

  try {
    await Service.update(
      {
        title,
        status,
        type_service,
        updated_by: name,
      },
      {
        where: {
          uuid: id,
        },
      }
    );
    return res.status(200).json({ message: 'Surat masuk berhasil di ubah.' });
  } catch (error) {
    return res.status(500).json({
      message: 'Terjadi kesalahan saat mengubah surat masuk.',
      error,
    });
  }
};

// Admin
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByPk(id);

    await service.destroy();

    return res.status(200).json({ message: 'berhasil menghapus service' });
  } catch (error) {
    return res.status(500).json(error);
  }
};
