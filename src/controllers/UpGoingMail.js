import { Op } from 'sequelize';
import UpGoingMail from '../models/ModelUpGoingMails.js';
import Users from '../models/ModelUsers.js';
import path from 'path';

// Admin & User
export const getUpGoingMails = async (req, res) => {
  try {
    const search = req.query.search || '';
    const filter = req.query.filter || '';
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 10;
    const offset = (page - 1) * limit;

    const whereClouse = {
      reference_number: {
        [Op.like]: `%${search}%`,
      },
    };

    if (filter) {
      whereClouse.status_latter = filter;
    }

    const { rows: response, count: totalRows } =
      await UpGoingMail.findAndCountAll({
        attributes: [
          'reference_number',
          'date_latter',
          'objective',
          'regarding',
          'summary',
          'path_file',
          'status_latter',
          'created_by',
          'updated_by',
          'uuid',
        ],
        limit: limit,
        offset: offset,
        where: whereClouse,
      });

    const totalSurat = await UpGoingMail.count();
    const totalDraft = await UpGoingMail.count({
      where: {
        status_latter: 'Draft',
      },
    });
    const totalSend = await UpGoingMail.count({
      where: {
        status_latter: 'Terkirim',
      },
    });
    const totalProcess = await UpGoingMail.count({
      where: {
        status_latter: 'Dalam Proses',
      },
    });

    return res.status(200).json({
      response,
      totalRows,
      totalSurat,
      totalDraft,
      totalSend,
      totalProcess,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Admin
export const getUpGoingMailId = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await UpGoingMail.findByPk(id);
    if (!response)
      return res.status(404).json({ message: 'Tidak ada data surat kkeluar.' });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Admin
export const createUpGoingMail = async (req, res) => {
  const {
    reference_number,
    date_latter,
    objective,
    regarding,
    summary,
    status_latter,
  } = req.body;
  const { name } = req;
  const checkCodeMail = await UpGoingMail.findOne({
    where: { reference_number },
  });
  if (checkCodeMail)
    return res
      .status(400)
      .json({ reference_number: 'Nomor Surat Keluar Sudah Ada' });
  if (!req.files)
    return res.status(422).json({ file: 'File surat tidak boleh kosong' });
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
    )}/public/surat-keluar/${fileName}`;

    file.mv(`public/surat-keluar/${fileName}`);

    await UpGoingMail.create({
      reference_number,
      date_latter,
      objective,
      regarding,
      summary,
      status_latter,
      created_by: name,
      letter_file: fileName,
      path_file: pathFile,
    });
    return res
      .status(201)
      .json({ message: 'Berhasil menyimpan surat keluar.' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Admin
export const updateUpGoingMail = async (req, res) => {
  const {
    reference_number,
    date_latter,
    objective,
    regarding,
    summary,
    status_latter,
  } = req.body;
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
      )}/public/surat-keluar/${fileName}`;

      file.mv(`public/surat-keluar/${fileName}`);

      await UpGoingMail.update(
        {
          reference_number,
          date_latter,
          objective,
          regarding,
          summary,
          status_latter,
          updated_by: name,
          letter_file: fileName,
          path_file: pathFile,
        },
        {
          where: {
            uuid: id,
          },
        }
      );

      return res.status(200).json({ message: 'Berhasil update surat keluar' });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    try {
      await UpGoingMail.update(
        {
          reference_number,
          date_latter,
          objective,
          regarding,
          summary,
          status_latter,
          updated_by: name,
        },
        {
          where: {
            uuid: id,
          },
        }
      );

      return res.status(200).json({ message: 'Berhasil update surat keluar' });
    } catch (error) {
      console.log(error);

      return res.status(500).json(error);
    }
  }
};

// Admin
export const deleteUpGoingMail = async (req, res) => {
  try {
    const { id } = req.params;

    const goingMail = await UpGoingMail.findByPk(id);
    if (!goingMail)
      return res.status(404).json({ message: 'Surat Keluar tidak ditemukan.' });

    goingMail.destroy();

    return res.status(200).json({ message: 'Surat keluar berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json(error);
  }
};
