import Stalls from '../models/ModelStalls.js';
import StallCategories from '../models/ModelStallCategories.js';
import path from 'path';
import fs from 'fs';
import { Op } from 'sequelize';
import formatPhoneNumber from '../utils/formatPhone.js';
import Users from '../models/ModelUsers.js';

export const getStallBySearch = async (req, res) => {
  try {
    const id = req.query.id;
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { rows: response, count: total } = await Stalls.findAndCountAll({
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
      where: {
        name_stall: {
          [Op.like]: `%${search}%`,
        },
        ...(id && { stall_category_id: id }),
      },
      order: [['price', 'asc']],
      ...(limit && { limit: limit }),
      ...(offset && { offset: offset }),
    });

    const totalRow = Math.ceil(total / limit);

    return res.status(200).json({ response, totalRow, page });
  } catch (error) {
    console.error('Error in getStallBySearch:', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

export const getStallById = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await Stalls.findOne({
      where: {
        uuid: id,
      },
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
        'stall_category_id',
        'user_id',
      ],
      include: [
        {
          model: StallCategories,
          as: 'stallCategories',
          foreignKey: 'stall_category_id',
          attributes: ['title'],
        },
        {
          model: Users,
          as: 'users',
          foreignKey: 'user_id',
          attributes: ['fullname'],
        },
      ],
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getStallByUser = async (req, res) => {
  try {
    const { userId } = req;

    const response = await Stalls.findAll({
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
        'stall_category_id',
        'user_id',
      ],
      order: [['name_stall', 'ASC']],
      where: {
        user_id: userId,
      },
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Admin & User
export const createVillageStall = async (req, res) => {
  const {
    name_stall,
    price,
    phone,
    address,
    latitude,
    longitude,
    stall_category_id,
    description,
  } = req.body;
  const { userId } = req;

  if (!req.files)
    return res.status(422).json({ file: 'Gambar tidak boleh kosong.' });
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

  const phoneFormat = formatPhoneNumber(phone);

  const user = await Users.findByPk(userId);

  try {
    await Stalls.create({
      name_stall,
      address,
      latitude,
      longitude,
      stall_category_id,
      price,
      description,
      name_seller: user.fullname,
      user_id: userId,
      phone: phoneFormat,
      img: filename,
      path_img: pathFile,
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
    name_stall,
    price,
    name_seller,
    phone,
    address,
    latitude,
    longitude,
    stall_category_id,
  } = req.body;
  const { id } = req.params;

  const Stall = await Stalls.findByPk(id);

  if (!req.files) {
    try {
      await Stalls.update(
        {
          name_stall,
          price,
          name_seller,
          phone,
          address,
          latitude,
          longitude,
          stall_category_id,
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
          name_stall,
          price,
          name_seller,
          phone,
          address,
          latitude,
          longitude,
          category_id,
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
      fs.unlinkSync(`public/village-stall/${stall.img}`);
    }

    stall.destroy();
    return res.status(200).json({ message: 'Berhasil menghapus lapak' });
  } catch (error) {
    return res.status(500).json(error);
  }
};
