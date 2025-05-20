import IncomingMails from "../models/ModelIncomingMails.js";
import Users from "../models/ModelUsers.js";
import path from "path";
import fs from "fs";

// Admin & User
export const getIncomingMails = async (req, res) => {
  try {
    const incomingMails = await IncomingMails.findAll({
      attributes: [
        "uuid",
        "reference_number",
        "date_latter",
        "date_received",
        "sender",
        "regarding",
        "summary",
        "letter_file",
        "path_file",
        "created_by",
        "updated_by",
      ],
      include: [
        {
          model: Users,
          as: "creator",
          attributes: ["uuid", "fullname"],
        },
        {
          model: Users,
          as: "updater",
          attributes: ["uuid", "fullname"],
        },
      ],
    });

    return res.status(200).json(incomingMails);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server.", error });
  }
};

// Admin & User
export const getIncomingMailId = async (req, res) => {
  const { id } = req.params;

  try {
    const incomingMail = await IncomingMails.findByPk(id, {
      attributes: [
        "uuid",
        "reference_number",
        "date_latter",
        "date_received",
        "sender",
        "regarding",
        "summary",
        "letter_file",
        "path_file",
        "created_by",
        "updated_by",
      ],
    });

    return res.status(200).json(incomingMail);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Gagal mengambil data surat masuk.", error });
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
  } = req.body;
  const { userId } = req;

  const incomingMail = await IncomingMails.findAll({
    where: { reference_number },
  });

  if (incomingMail.length > 0)
    return res
      .status(400)
      .json({ reference_number: "Nomor surat sudah terdaftar." });

  if (!req.files) return res.status(422).json({ file: "File wajib diunggah." });

  try {
    const file = req.files.file;
    const ext = path.extname(file.name);
    const fileSize = file.data.length;
    const allowedFileTypes = [".pdf"];

    if (!allowedFileTypes.includes(ext.toLowerCase()))
      return res
        .status(422)
        .json({ file: "Format file tidak didukung, harus PDF." });

    if (fileSize > 3000000)
      return res
        .status(422)
        .json({ file: "Ukuran file terlalu besar, maksimal 3MB." });

    const fileName = Date.now() + ext;
    const pathFile = `${req.protocol}://${req.get(
      "host"
    )}/public/surat-masuk/${fileName}`;

    file.mv(`public/surat-masuk/${fileName}`);

    await IncomingMails.create({
      reference_number,
      date_latter,
      date_received,
      sender,
      regarding,
      summary,
      path_file: pathFile,
      letter_file: fileName,
      created_by: userId,
    });

    return res
      .status(201)
      .json({ message: "Surat masuk berhasil ditambahkan." });
  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan saat menyimpan surat masuk.",
      error,
    });
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
  } = req.body;
  const { userId } = req;

  if (req.files) {
    try {
      const file = req.files.file;
      const ext = path.extname(file.name);
      const fileSize = file.data.length;
      const allowedFileTypes = [".pdf"];

      if (!allowedFileTypes.includes(ext.toLowerCase()))
        return res
          .status(422)
          .json({ file: "Format file tidak didukung, harus PDF." });

      if (fileSize > 3000000)
        return res
          .status(422)
          .json({ file: "Ukuran file terlalu besar, maksimal 3MB." });

      const fileName = Date.now() + ext;
      const pathFile = `${req.protocol}://${req.get(
        "host"
      )}/public/surat-masuk/${fileName}`;

      file.mv(`public/surat-masuk/${fileName}`);

      const incomingMail = await IncomingMails.findByPk(id);

      if (incomingMail.letter_file !== null) {
        fs.unlinkSync(`public/surat-masuk/${incomingMail.letter_file}`);
      }

      await IncomingMails.update(
        {
          reference_number,
          date_latter,
          date_received,
          sender,
          regarding,
          summary,
          path_file: pathFile,
          letter_file: fileName,
          updated_by: userId,
        },
        {
          where: {
            uuid: id,
          },
        }
      );

      return res.status(200).json({ message: "Surat masuk berhasil di ubah." });
    } catch (error) {
      return res.status(500).json({
        message: "Terjadi kesalahan saat mengubah surat masuk.",
        error,
      });
    }
  } else {
    try {
      await IncomingMails.update(
        {
          reference_number,
          date_latter,
          date_received,
          sender,
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
      return res.status(200).json({ message: "Surat masuk berhasil di ubah." });
    } catch (error) {
      return res.status(500).json({
        message: "Terjadi kesalahan saat mengubah surat masuk.",
        error,
      });
    }
  }
};

// Only Admin
export const deleteIncomingMail = async (req, res) => {
  const { id } = req.params;

  try {
    const incomingMail = await IncomingMails.findByPk(id);
    if (incomingMail.letter_file !== null) {
      fs.unlinkSync(`public/surat-masuk/${incomingMail.letter_file}`);
    }

    incomingMail.destroy();
    return res.status(200).json({ message: "Surat masuk berhasil di hapus" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Gagal saat menghapus data: ", error });
  }
};
