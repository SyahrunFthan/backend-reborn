import Galeri from '../models/ModelGaleri.js';
import path from 'path';
import fs from 'fs';

export const createGaleri = async (req, res) => {
  const { title } = req.body;
  const { userId } = req;

  if (!req.files) {
    return res.status(422).json({ message: 'Img harus di isi!' });
  }

  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const allowedTypes = ['.png', '.jpg', '.jpeg'];
  const filename = Date.now() + ext;

  if (!allowedTypes.includes(ext.toLowerCase()))
    return res.status(422).json({ file: 'Format file tidak di dukung!' });

  if (fileSize > 3000000)
    return res.status(422).json({ file: 'Ukuran file max 3mb' });

  const pathFile = `${req.protocol}://${req.get(
    'host'
  )}/public/galeri/${filename}`;

  file.mv(`public/galeri/${filename}`);

  try {
    await Galeri.create({
      title,
      img: filename,
      path_img: pathFile,
      created_by: userId,
    });

    return res.status(201).json({ message: 'Berhasil Menambahkan Galeri!' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const updateGaleri = async (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  const { userId } = req;

  const galeri = await Galeri.findByPk(id);

  if (!galeri) {
    return res.status(404).json({ message: 'Galeri tidak di temukan!' });
  }

  if (!req.files) {
    try {
      await galeri.update({
        title,
        updated_by: userId,
      });

      return res.status(200).json({ message: 'Berhasil Mengupdate Galeri!' });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    try {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = ['.png', '.jpg', '.jpeg'];
      const filename = Date.now() + ext;

      if (!allowedTypes.includes(ext.toLowerCase()))
        return res.status(422).json({ file: 'Format file tidak di dukung!' });

      if (fileSize > 3000000)
        return res.status(422).json({ file: 'Ukuran file max 3mb' });

      const pathFile = `${req.protocol}://${req.get(
        'host'
      )}/public/galeri/${filename}`;

      file.mv(`public/galeri/${filename}`);

      if (galeri.img !== null) {
        fs.unlinkSync(`public/galeri/${galeri.img}`);
      }

      await galeri.update({
        title,
        img: filename,
        path_img: pathFile,
        updated_by: userId,
      });

      return res.status(200).json({ message: 'Berhasil Mengupdate Galeri!' });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
};

export const deleteGaleri = async (req, res) => {
  const { id } = req.params;
  try {
    const galeri = await Galeri.findByPk(id);

    if (!galeri)
      return res.status(404).json({ message: 'Galeri tidak di temukan!' });

    if (galeri.img !== null) {
      fs.unlinkSync(`public/galeri/${galeri.img}`);
    }

    await galeri.destroy();

    return res.status(200).json({ message: 'Berhasil Menghapus Galeri!' });
  } catch (error) {
    return res.status(500).json(500);
  }
};
