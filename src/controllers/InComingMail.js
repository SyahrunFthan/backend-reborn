import InComingMail from '../models/ModelInComingMails.js';
import path from 'path';
import fs from 'fs';
import { Op } from 'sequelize';

// Admin & User
export const getIncomingMails = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = req.query.filter || '';
    const offset = (page - 1) * limit;

    const whereClause = {
      reference_number: {
        [Op.like]: `%${search}%`,
      },
    };

    if (filter !== '') {
      whereClause.status_latter = filter;
    }

    const { rows: response, count: totalRows } =
      await InComingMail.findAndCountAll({
        attributes: [
          'uuid',
          'reference_number',
          'date_latter',
          'date_received',
          'sender',
          'regarding',
          'summary',
          'letter_file',
          'path_file',
          'created_by',
          'updated_by',
          'status_latter',
        ],
        offset,
        limit,
        where: whereClause,
      });

    const totalMail = await InComingMail.count();

    const totalRead = await InComingMail.count({
      where: {
        status_latter: 'Sudah Dibaca',
      },
    });

    const totalUnRead = await InComingMail.count({
      where: {
        status_latter: 'Belum Dibaca',
      },
    });

    const totalProcess = await InComingMail.count({
      where: {
        status_latter: 'Proses',
      },
    });

    return res.status(200).json({
      response,
      totalRows,
      page,
      totalProcess,
      totalUnRead,
      totalRead,
      totalMail,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Terjadi kesalahan pada server.', error });
  }
};

// Admin & User
export const getIncomingMailId = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await InComingMail.findByPk(id, {
      attributes: [
        'uuid',
        'reference_number',
        'date_latter',
        'date_received',
        'sender',
        'regarding',
        'summary',
        'letter_file',
        'path_file',
        'created_by',
        'updated_by',
        'status_latter',
      ],
    });

    if (!response)
      return res.status(404).json({ message: 'Data tidak ditemukan.' });

    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Gagal mengambil data surat masuk.', error });
  }
};

// Only Admin
export const createIncomingMail = async (req, res) => {
  const {
    reference_number,
    date_latter,
    date_received,
    sender,
    regarding,
    summary,
    status_latter,
  } = req.body;
  const { name } = req;

  const incomingMail = await InComingMail.findAll({
    where: { reference_number },
  });

  if (incomingMail.length > 0)
    return res
      .status(400)
      .json({ reference_number: 'Nomor surat sudah terdaftar.' });

  if (!req.files) return res.status(422).json({ file: 'File wajib diunggah.' });

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
    )}/public/surat-masuk/${fileName}`;

    file.mv(`public/surat-masuk/${fileName}`);

    await InComingMail.create({
      reference_number,
      date_latter,
      date_received,
      sender,
      regarding,
      summary,
      status_latter,
      path_file: pathFile,
      letter_file: fileName,
      created_by: name,
    });

    return res
      .status(201)
      .json({ message: 'Surat masuk berhasil ditambahkan.' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Only Admin
export const updateIncomingMail = async (req, res) => {
  const { id } = req.params;
  const {
    reference_number,
    date_latter,
    date_received,
    sender,
    regarding,
    summary,
    status_latter,
  } = req.body;
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
      )}/public/surat-masuk/${fileName}`;

      file.mv(`public/surat-masuk/${fileName}`);

      const incomingMail = await InComingMail.findByPk(id);

      if (incomingMail.letter_file !== null) {
        fs.unlinkSync(`public/surat-masuk/${incomingMail.letter_file}`);
      }

      await InComingMail.update(
        {
          reference_number,
          date_latter,
          date_received,
          sender,
          regarding,
          summary,
          status_latter,
          path_file: pathFile,
          letter_file: fileName,
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
  } else {
    try {
      await InComingMail.update(
        {
          reference_number,
          date_latter,
          date_received,
          sender,
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
      return res.status(200).json({ message: 'Surat masuk berhasil di ubah.' });
    } catch (error) {
      return res.status(500).json({
        message: 'Terjadi kesalahan saat mengubah surat masuk.',
        error,
      });
    }
  }
};

// Only Admin
export const deleteIncomingMail = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await InComingMail.findByPk(id);
    if (response.letter_file !== null) {
      fs.unlinkSync(`public/surat-masuk/${response.letter_file}`);
    }

    response.destroy();
    return res.status(200).json({ message: 'Surat masuk berhasil di hapus' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Gagal saat menghapus data: ', error });
  }
};
