import StallCategories from '../models/ModelStallCategories.js';
import path from 'path';
import fs from 'fs';

// Super Admin & Admin
export const createStallCategories = async (req, res) => {
  const { title } = req.body;

  if (!req.files)
    return res.status(422).json({ message: 'Icon harus di isi!' });

  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const allowedTypes = ['.png', '.jpg', '.jpeg'];
  const filename = Date.now() + ext;

  if (!allowedTypes.includes(ext.toLowerCase()))
    return res.status(422).json({ message: 'Format icon tidak di dukung!' });
  if (fileSize > 300000)
    return res.status(422).json({ message: 'Ukuran icon terlalu besar!' });

  const pathIcon = `${req.protocol}://${req.get(
    'host'
  )}/public/icons/${filename}`;

  file.mv(`public/icons/${filename}`);

  try {
    await StallCategories.create({
      title: title,
      icon: filename,
      path_icon: pathIcon,
    });

    return res.status(201).json({ message: 'Berhasil menambahkan kategori!' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Super Admin & Admin
export const updateStallCategories = async (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const stallCategories = await StallCategories.findByPk(id);

  if (!req.files) {
    try {
      await StallCategories.update(
        {
          title: title,
        },
        {
          where: {
            uuid: id,
          },
        }
      );

      return res.status(200).json({ message: 'Berhasil mengubah kategori!' });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const allowedTypes = ['.png', '.jpg', '.jpeg'];
    const filename = Date.now() + ext;

    if (!allowedTypes.includes(ext.toLowerCase()))
      return res.status(422).json({ message: 'Format icon tidak di dukung!' });
    if (fileSize > 300000)
      return res.status(422).json({ message: 'Ukuran icon terlalu besar!' });

    const pathIcon = `${req.protocol}://${req.get(
      'host'
    )}/public/icons/${filename}`;

    file.mv(`public/icons/${filename}`);

    if (stallCategories.icon !== null) {
      fs.unlinkSync(`public/icons/${stallCategories.icon}`);
    }

    try {
      await StallCategories.update(
        {
          title: title,
          icon: filename,
          path_icon: pathIcon,
        },
        {
          where: {
            uuid: id,
          },
        }
      );

      return res.status(200).json({ message: 'Berhasil mengubah kategori!' });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
};

// Super Admin & Admin
export const deleteCategories = async (req, res) => {
  const { id } = req.params;

  const stallCategories = await StallCategories.findByPk(id);

  if (stallCategories.icon !== null) {
    fs.unlinkSync(`public/icons/${stallCategories.icon}`);
  }

  try {
    await StallCategories.destroy({
      where: {
        uuid: id,
      },
    });

    return res.status(200).json({ message: 'Berhasil menghapus kategori!' });
  } catch (error) {
    return res.status(500).json(error);
  }
};
