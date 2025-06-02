import SubmissionService from '../models/ModelSubmissionService.js';
import path from 'path';
import fs from 'fs';
import encrypt from '../utils/encryption.js';
import { Op } from 'sequelize';
import Service from '../models/ModelServices.js';

// Mobile Application
export const getSubmissionServiceUser = async (req, res) => {
  try {
    const search = req.query.search || '';

    const response = await SubmissionService.findAll({
      attributes: [
        'service_id',
        'user_id',
        'name',
        'createdAt',
        'is_signed',
        'path_file',
        'uuid',
      ],
      include: [
        {
          model: Service,
          as: 'service',
          foreignKey: 'service_id',
          attributes: ['type_service', 'title'],
          where: {
            title: {
              [Op.like]: `%${search}%`,
            },
          },
        },
      ],
      where: {
        user_id: req.userId,
      },
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Mobile Application
export const createSubmissionService = async (req, res) => {
  try {
    const { name: applicant, service_id, nik, description } = req.body;
    const { name, userId } = req;

    if (!req.files)
      return res.status(422).json({ file: 'Anda belum mengupload pdf.' });

    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const allowedTypes = ['.pdf'];
    const filename = Date.now() + ext;

    if (!allowedTypes.includes(ext.toLowerCase()))
      return res.status(422).json({ file: 'Format tidak di dukung.' });
    if (fileSize > 3000000)
      return res
        .status(422)
        .json({ file: 'Ukuran pdf terlalu besar, max 3mb.' });

    const pathFile = `${req.protocol}://${req.get(
      'host'
    )}/public/applicants/${filename}`;

    file.mv(`public/applicants/${filename}`);
    const encryptNik = encrypt(nik);

    await SubmissionService.create({
      service_id,
      description,
      nik: encryptNik,
      name: applicant,
      user_id: userId,
      file_name: filename,
      path_file: pathFile,
      created_by: name,
    });

    return res
      .status(201)
      .json({ message: 'Pengajuan anda berhasil dikirim.' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const deleteSubmissionService = async (req, res) => {
  try {
    const { id } = req.params;

    const checkSubmission = await SubmissionService.findOne({
      where: { uuid: id },
    });
    if (checkSubmission.file_name !== null) {
      fs.unlinkSync(`public/applicants/${checkSubmission.file_name}`);
    }

    checkSubmission.destroy();

    return res.status(200).json({ message: 'Pengajuan berhasil dihapus!' });
  } catch (error) {
    return res.status(500).json(error);
  }
};
