import Service from '../models/ModelServices.js';
import path from 'path';
import Users from '../models/ModelUsers.js';

// Admin & User
export const getService = async (req, res) => {
  try {
    const response = await Service.findAll({
      attributes: [
        'uuid',
        'title',
        'status',
        'type_service',
        'file',
        'path_file',
        'created_by',
        'updated_by',
      ],
    });

    return res.status(200).json({ response });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getServiceByType = async (req, res) => {
  try {
    const type_service = req.query.type_service || '';
    const response = await Service.findAll({
      attributes: ['uuid', 'title', 'path_file'],
      where: { type_service },
    });

    return res.status(200).json(response);
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
        'title',
        'status',
        'type_service',
        'file',
        'path_file',
      ],
      include: [
        {
          model: Users,
          as: 'created',
          attributes: ['uuid', 'fullname'],
        },
      ],
    });

    return res.status(200).json({ response });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// User
export const createService = async (req, res) => {
  const { title, type_service } = req.body;
  const { userId } = req;

  if (!req.files) return res.status(422).json({ file: 'File wajib diunggah.' });

  const checkService = await Service.findAll({
    where: { title, type_service },
  });

  if (checkService.length > 0)
    return res.status(409).json({ title: 'Layanan sudah ditambahkan.' });

  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const allowedTypes = ['.pdf'];
  const filename = Date.now() + ext;

  if (!allowedTypes.includes(ext.toLowerCase()))
    return res.status(422).json({ file: 'Format file tidak di dukung!' });

  if (fileSize > 3000000)
    return res.status(422).json({ file: 'Ukuran file max 3mb' });

  const pathFile = `${req.protocol}://${req.get(
    'host'
  )}/public/service/${filename}`;

  file.mv(`public/service/${filename}`);

  try {
    await Service.create({
      title,
      type_service,
      file: filename,
      path_file: pathFile,
      created_by: userId,
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
  const { userId } = req;

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
          updated_by: userId,
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
