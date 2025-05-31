import SubmissionService from '../models/ModelSubmissionService.js';
import path from 'path';

// Mobile Application
export const createSubmissionService = async (req, res) => {
  try {
    const { name: applicant, service_id, nik, description } = req.body;
    const { name } = req;

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

    await SubmissionService.create({
      service_id,
      nik,
      description,
      name: applicant,
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
