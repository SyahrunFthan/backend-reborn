import News from '../models/ModelNews.js';
import path from 'path';
import fs from 'fs';
import NewsFile from '../models/ModelNewsFile.js';

// Admin & User
export const getNews = async (req, res) => {
  try {
    const response = await NewsFile.findAll({
      attributes: ['uuid', 'img', 'path_img'],
      include: [
        {
          model: News,
          as: 'News',
          attributes: ['uuid', 'title', 'description'],
        },
      ],
    });
    return res.status(200).json({ response });
  } catch (error) {
    return res.status(500).json(error);
  }
};
// Admin & User
export const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await NewsFile.findAll({
      where: {
        news_id: id,
      },
      attributes: ['img', 'path_img'],
      include: [
        {
          model: News,
          as: 'News',
          attributes: ['uuid', 'title', 'description'],
        },
      ],
    });

    if (!response) {
      return res
        .status(404)
        .json({ message: 'tidak ada berita yang di temukan' });
    }

    return res.status(200).json({ response });
  } catch (error) {
    return res.status(500).json(error);
  }
};
// Admin
export const createNews = async (req, res) => {
  const { title, description } = req.body;
  const { userId } = req;

  if (!req.files || req.files.file.length === 0) {
    return res.status(422).json({ message: 'Img harus di isi!' });
  }

  const files = Array.isArray(req.files.file)
    ? req.files.file
    : [req.files.file];
  const allowedTypes = ['.png', '.jpg', '.jpeg'];
  const fileSizeLimit = 300000;
  let selectedImages = [];

  for (const file of files) {
    const fileSize = file.data.length;
    const ext = path.extname(file.name);

    if (!allowedTypes.includes(ext.toLowerCase())) {
      return res.status(422).json({ message: 'Format img tidak di dukung!' });
    }
    if (fileSize > fileSizeLimit) {
      return res.status(422).json({ message: 'Ukuran img terlalu besar!' });
    }

    const filename = Date.now() + ext;
    file.mv(`public/news/${filename}`);

    selectedImages.push(filename);

    await NewsFile.create({
      img: filename,
      path_img: `${req.protocol}://${req.get('host')}/public/news/${filename}`,
    });
  }

  try {
    const newsEntry = await News.create({
      title: title,
      description: description,
      created_by: userId,
    });

    await NewsFile.update(
      { news_id: newsEntry.uuid },
      { where: { img: selectedImages } }
    );

    return res.status(201).json({ message: 'Berhasil membuat news' });
  } catch (error) {
    return res.status(500).json(error);
  }
};
// Admin
export const updateNews = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const newsEntry = await News.findByPk(id);
    if (!newsEntry) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }

    await News.update({ title, description }, { where: { uuid: id } });

    if (req.files && req.files.file) {
      const files = Array.isArray(req.files.file)
        ? req.files.file
        : [req.files.file];
      const allowedTypes = ['.png', '.jpg', '.jpeg'];
      const fileSizeLimit = 300000;
      let selectedImages = [];

      for (const file of files) {
        const fileSize = file.data.length;
        const ext = path.extname(file.name);

        if (!allowedTypes.includes(ext.toLowerCase())) {
          return res
            .status(422)
            .json({ message: 'Format img tidak di dukung!' });
        }
        if (fileSize > fileSizeLimit) {
          return res.status(422).json({ message: 'Ukuran img terlalu besar!' });
        }

        const filename = Date.now() + ext;
        await file.mv(`public/News/${filename}`);

        selectedImages.push(filename);

        await NewsFile.create({
          img: filename,
          path_img: `${req.protocol}://${req.get(
            'host'
          )}/public/News/${filename}`,
          news_id: id,
        });
      }
    }

    return res.status(200).json({ message: 'Berita berhasil diperbarui' });
  } catch (error) {
    console.error('Error updating news:', error);
    return res
      .status(500)
      .json({ message: 'Terjadi kesalahan', error: error.message });
  }
};
// Admin
export const deleteNews = async (req, res) => {
  const { id } = req.params;

  try {
    const newsFile = await NewsFile.findAll({
      where: {
        news_id: id,
      },
    });

    for (const file of newsFile) {
      if (file.img) {
        fs.unlinkSync(`public/news/${file.img}`);
      }
    }

    const news = await News.findByPk(id);
    if (!news) {
      return res.status(404).json({ message: 'Berita tidak ditemukan!' });
    }

    await NewsFile.destroy({
      where: {
        news_id: id,
      },
    });

    await news.destroy();

    return res.status(200).json({ message: 'berhasil menghapus news!' });
  } catch (error) {
    return res.status(500).json(error);
  }
};
