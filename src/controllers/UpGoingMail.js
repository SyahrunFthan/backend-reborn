import UpGoingMail from '../models/ModelUpGoingMails.js';
import Users from '../models/ModelUsers.js';

// Admin & User
export const getUpGoingMails = async (req, res) => {
  try {
    const response = await UpGoingMail.findAll({
      attributes: [
        'reference_number',
        'date_latter',
        'objective',
        'regarding',
        'summary',
        'path_file',
        'created_by',
        'updated_by',
      ],
      include: [
        {
          model: Users,
          as: 'creator',
          attributes: ['uuid', 'fullname'],
        },
        {
          model: Users,
          as: 'updater',
          attributes: ['uuid', 'fullname'],
        },
      ],
    });
    if (response.length == 0)
      return res.status(404).json({ message: 'Tidak ada data surat keluar.' });

    return res.status(200).json(response);
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
  const { reference_number, date_letter, objective, regarding, summary } =
    req.body;
  const { userId } = req.userId;

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
      date_letter,
      objective,
      regarding,
      summary,
      created_by: userId,
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
  const { reference_number, date_letter, objective, regarding, summary } =
    req.body;
  const { id } = req.params;
  const { userId } = req.userId;

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
          date_letter,
          objective,
          regarding,
          summary,
          updated_by: userId,
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
          date_letter,
          objective,
          regarding,
          summary,
          updated_by: userId,
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
  }
};

// Admin
export const deleteUpGoingMail = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await UpGoingMail.findByPk(id);
    if (!response)
      return res.status(404).json({ message: 'Surat Keluar tidak ditemukan.' });

    response.destroy();

    return res.status(200).json({ message: 'Surat keluar berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json(error);
  }
};
