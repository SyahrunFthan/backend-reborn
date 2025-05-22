import News from '../models/ModelNews.js';
import path from 'path';
import fs from 'fs';

// user
import NewsFile from '../models/ModelNewsFile.js'; // Pastikan model ada

export const createNews = async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;

  // Memastikan ada file yang di-upload
  if (!req.files || req.files.file.length === 0) {
    return res.status(422).json({ message: 'Img harus di isi!' });
  }

  const files = req.files.file; // Mengambil semua file yang di-upload
  const allowedTypes = ['.png', '.jpg', '.jpeg'];
  const fileSizeLimit = 300000; // 300 KB
  let selectedImage = null; // Untuk menyimpan nama gambar utama

  // Loop melalui setiap file untuk validasi dan penyimpanan
  for (const file of files) {
    const fileSize = file.data.length;
    const ext = path.extname(file.name);

    // Validasi format dan ukuran file
    if (!allowedTypes.includes(ext.toLowerCase())) {
      return res.status(422).json({ message: 'Format img tidak di dukung!' });
    }
    if (fileSize > fileSizeLimit) {
      return res.status(422).json({ message: 'Ukuran img terlalu besar!' });
    }

    // Simpan file ke server
    const filename = Date.now() + ext;
    file.mv(`public/News/${filename}`);

    // Pilih file pertama sebagai gambar utama
    if (!selectedImage) {
      selectedImage = filename;
    }

    // Simpan informasi file ke tabel news_file
    await NewsFile.create({
      news_id: null, // Akan diisi setelah news dibuat
      file_name: filename,
      path: `${req.protocol}://${req.get('host')}/public/News/${filename}`,
    });
  }

  try {
    // Buat entri di tabel news
    const newsEntry = await News.create({
      title: title,
      description: description,
      img: selectedImage,
      path_img: `${req.protocol}://${req.get('host')}/public/News/${selectedImage}`,
      created_by: id,
    });

    // Update news_file dengan news_id
    await NewsFile.update(
      { news_id: newsEntry.uuid }, // Asumsi uuid adalah primary key di News
      { where: { news_id: null } } // Update semua file yang belum memiliki news_id
    );

    return res.status(201).json({ message: 'Berhasil membuat news' });
  } catch (error) {
    return res.status(500).json(error);
  }
};
// user
export const updateNews = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const news = await News.findByPk(id);

  if (!req.files) {
    try {
      await Stalls.update(
        {
          title: title,
          description: description,
        },
        {
          where: {
            uuid: id,
          },
        }
      );

      return res.status(200).json({ message: 'Berhasil mengubah News!' });
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
      return res.status(422).json({ message: 'Format img tidak di dukung!' });
    if (fileSize > 300000)
      return res.status(422).json({ message: 'Ukuran img terlalu besar!' });

    const pathImg = `${req.protocol}://${req.get(
      'host'
    )}/public/news/${filename}`;

    file.mv(`public/news/${filename}`);

    if (news.img !== null) {
      fs.unlinkSync(`public/news/${news.img}`);
    }

    try {
      await News.update(
        {
          title: title,
          description: description,
          img: filename,
          path_img: pathImg,
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

// user
export const deleteNews = async (req, res) => {
  const { id } = req.params;

  const news = await News.findByPk(id);

  if (news.img !== null) {
    fs.unlinkSync(`public/news/${news.img}`);
  }

  try {
    await News.destroy({
      where: {
        uuid: id,
      },
    });

    return res.status(200).json({ message: 'berhasil menghapus news!' });
  } catch (error) {
    return res.status(500).json(error);
  }
};
