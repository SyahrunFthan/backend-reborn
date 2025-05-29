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

  if (!req.files) return res.status(422).json({ file: 'File wajib diunggah.' });

  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const allowedTypes = ['.pdf'];
  const filename = Date.now() + ext;

  if (!allowedTypes.includes(ext.toLowerCase()))
    return res.status(422).json({ message: 'Format file tidak di dukung!' });

  if (fileSize > 3000000)
    return res.status(422).json({ message: 'Ukuran file max 3mb' });

  const pathFile = `${req.protocol}://${req.get(
    'host'
  )}/public/service/${filename}`;

  try {
    await Service.create({
      type_service,
      title,
      file: filename,
      path_file: pathFile,
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
  const { id } = req.params;
  const { name } = req;

  if (req.files) {
    try {
      const file = req.files.file;
      const ext = path.extname(file.name);
      const fileSize = file.data.length;
      const allowedFileTypes = ['.pdf'];

      if (!allowedFileTypes.includes(ext.toLowerCase()))
        return res
          .status(422)
          .json({ file: 'Format file tidak didukung, harus PDF.' });

      if (fileSize > 3000000)
        return res
          .status(422)
          .json({ file: 'Ukuran file terlalu besar, maksimal 3MB.' });

      const fileName = Date.now() + ext;
      const pathFile = `${req.protocol}://${req.get(
        'host'
      )}/public/service/${fileName}`;

      file.mv(`public/service/${fileName}`);

      const service = await Service.findByPk(id);

      if (service.file !== null) {
        fs.unlinkSync(`public/service/${service.file}`);
      }

      await service.update(
        {
          title,
          status,
          type_service,
          path_file: pathFile,
          file: fileName,
          updated_by: name,
        },
        {
          where: {
            uuid: id,
          },
        }
      );

      return res.status(200).json({ message: 'service berhasil di ubah.' });
    } catch (error) {
      return res.status(500).json({
        message: 'Terjadi kesalahan saat mengubah service.',
        error,
      });
    }
  } else {
    try {
      await Service.update(
        {
          title,
          status,
          type_service,
          updated_by: userId,
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
