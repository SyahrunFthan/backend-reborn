import Stalls from '../models/ModelStalls.js';
import StallCategories from '../models/ModelStallCategories.js';
import path from 'path';
import fs from 'fs';

// Admin
export const createVillageStall = async (req, res) => {
  const {
    title,
    price,
    name_seller,
    phone,
    address,
    latitude,
    longitude,
    category_id,
  } = req.body;

  if (!req.files || !req.files.file)
    return res.status(422).json({ message: 'gambar wajib di isi!' });

  const parsedPrice = typeof price === 'string' ? parseInt(price, 10) : price;

  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const allowedTypes = ['.png', '.jpg', '.jpeg'];
  const filename = Date.now() + ext;

  if (!allowedTypes.includes(ext.toLowerCase()))
    return res.status(422).json({ message: 'Format gambar tidak di dukung!' });

  if (fileSize > 3000000)
    return res.status(422).json({ message: 'Ukuran gambar terlalu besar!' });
  file.mv(`public/villageStall/${filename}`);

  const pathFile = `${req.protocol}://${req.get(
    'host'
  )}/public/villageStall/${filename}`;

  try {
    const checkCategory = await StallCategories.findByPk(category_id);
    if (!checkCategory) {
      return res.status(404).json({ meesage: 'category tidak ada' });
    }

    await Stalls.create({
      title: title,
      price: parsedPrice,
      name_seller: name_seller,
      phone: phone,
      address,
      img: filename,
      path_img: pathFile,
      latitude: latitude,
      longitude: longitude,
      category_id: category_id,
    });
    return res
      .status(201)
      .json({ message: 'berhasil menyimpan data lapak desa' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

//Admin
export const updateVillageStall = async (req, res) => {
  const {
    title,
    price,
    name_seller,
    phone,
    address,
    latitude,
    longitude,
    category_id,
  } = req.body;
  const { id } = req.params;

  const Stall = await Stalls.findByPk(id);

  if (!req.files) {
    try {
      await Stalls.update(
        {
          title: title,
          price: price,
          name_seller: name_seller,
          phone: phone,
          address: address,
          latitude: latitude,
          longitude: longitude,
          category_id: category_id,
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
      return res.status(422).json({ message: 'Format img tidak di dukung!' });
    if (fileSize > 300000)
      return res.status(422).json({ message: 'Ukuran img terlalu besar!' });

    const pathImg = `${req.protocol}://${req.get(
      'host'
    )}/public/stall/${filename}`;

    file.mv(`public/stall/${filename}`);

    if (Stall.img !== null) {
      fs.unlinkSync(`public/stall/${Stall.img}`);
    }

    try {
      await Stalls.update(
        {
          title: title,
          price: price,
          name_seller: name_seller,
          phone: phone,
          address: address,
          latitude: latitude,
          longitude: longitude,
          category_id: category_id,
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

// Admin
export const deleteVillageStall = async (req, res) => {
  try {
    const { id } = req.params;

    const stall = await Stalls.findByPk(id);

    if (stall.img !== null) {
      fs.unlinkSync(`public/villageStall/${Stalls.img}`);
    }

    stall.destroy();
    return res.status(200).json({ message: 'Berhasil menghapus stall' });
  } catch (error) {
    return res.status(500).json(error);
  }
};
