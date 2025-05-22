import Stalls from '../models/ModelStalls.js';
import StallCategories from '../models/ModelStallCategories.js';
import path from 'path';
import fs from 'fs';
import { Op } from 'sequelize';

export const getStallBySearch = async (req, res) => {
  try {
    const { id = '', page = 1 } = req.query;
    const search = req.query.search?.trim() || '';
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (search) {
      const searchConditions = [
        { name_stall: { [Op.like]: `%${search}%` } },
        { name_seller: { [Op.like]: `%${search}%` } },
      ];

      if (id) {
        searchConditions.push({ stall_category_id: id });
      }

      whereClause[Op.or] = searchConditions;
    } else if (id) {
      whereClause.stall_category_id = id;
    }

    const [stallCategories, stalls] = await Promise.all([
      StallCategories.findAll(),
      Stalls.findAndCountAll({
        attributes: [
          'uuid',
          'name_stall',
          'price',
          'name_seller',
          'phone',
          'address',
          'path_img',
          'img',
          'latitude',
          'longitude',
          'description',
        ],
        where: whereClause,
        order: [['price', 'asc']],
        limit,
        offset,
      }),
    ]);

    const totalPage = Math.ceil(stalls.count / limit);

    return res.status(200).json({
      stallCategories,
      stalls: stalls.rows,
      totalData: stalls.count,
      totalPage,
      currentPage: Number(page),
    });
  } catch (error) {
    console.error('Error in getStallBySearch:', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

// Admin & User
export const createVillageStall = async (req, res) => {
  const {
    name_stall,
    price,
    name_seller,
    phone,
    address,
    latitude,
    longitude,
    stall_category_id,
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

  const pathFile = `${req.protocol}://${req.get(
    'host'
  )}/public/village-stall/${filename}`;

  try {
    await Stalls.create({
      name_stall,
      price: parsedPrice,
      name_seller,
      phone,
      address,
      img: filename,
      path_img: pathFile,
      latitude,
      longitude,
      stall_category_id,
    });

    file.mv(`public/village-stall/${filename}`);

    return res
      .status(201)
      .json({ message: 'berhasil menyimpan data lapak desa' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

//Admin & User
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

// Admin & User
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
