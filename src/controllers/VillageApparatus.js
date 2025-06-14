import VillageApparatus from '../models/ModelAparatus.js';
import path from 'path';
import fs from 'fs';
import encrypt from '../utils/encryption.js';

export const getVillageApparaturForRegionForm = async (req, res) => {
  try {
    const response = await VillageApparatus.findAll({
      attributes: ['uuid', 'name', 'level'],
      where: {
        level: 0,
      },
    });

    return res.status(200).json({ response });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getVillageApparatus = async (req, res) => {
  try {
    const response = await VillageApparatus.findAll({
      attributes: [
        'uuid',
        'nik',
        'name',
        'place_birth',
        'date_birth',
        'status_married',
        'task',
        'position',
        'level',
        'address',
        'img',
        'path_img',
      ],
    });

    return res.status(200).json({ response });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getVillageApparatusById = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await VillageApparatus.findByPk(id, {
      attributes: [
        'uuid',
        'nik',
        'name',
        'place_birth',
        'date_birth',
        'status_married',
        'task',
        'position',
        'level',
        'address',
        'img',
        'path_img',
      ],
    });

    return res.status(200).json({ response });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Super Admin & Admin
export const createVillageApparatus = async (req, res) => {
  const {
    nik,
    name: nameAparatur,
    place_birth,
    date_birth,
    status_married,
    task,
    address,
    position,
    level,
  } = req.body;

  // const { name } = req;
  // if (!name) {
  //   return res.status(404).json({ message: 'tidak ada ditemukan' });
  // }

  if (!req.files || !req.files.file) {
    return res.status(422).json({ message: 'Gambar harus diisi!' });
  }

  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const allowedTypes = ['.png', '.jpg', '.jpeg'];
  const filename = Date.now() + ext;

  if (!allowedTypes.includes(ext.toLowerCase())) {
    return res.status(422).json({ message: 'Format gambar tidak didukung!' });
  }
  if (fileSize > 300000) {
    return res.status(422).json({ message: 'Ukuran gambar terlalu besar!' });
  }

  const pathImg = `${req.protocol}://${req.get(
    'host'
  )}/public/village-apparatus/${filename}`;

  file.mv(`public/village-apparatus/${filename}`);
  const encryptNik = encrypt(nik);
  try {
    await VillageApparatus.create({
      place_birth,
      status_married,
      address,
      task,
      position,
      level,
      nik: encryptNik,
      name: nameAparatur,
      date_birth: new Date(date_birth),
      img: filename,
      path_img: pathImg,
      created_by: 'Admin',
    });

    return res.status(201).json({
      message: 'Berhasil menambahkan pegawai desa (village apparatus)!',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi kesalahan', error });
  }
};

export const updateVillageApparatus = async (req, res) => {
  const {
    nik,
    nama,
    place_birth,
    date_birth,
    status_married,
    task,
    address,
    position,
    level,
  } = req.body;

  const { id } = req.params;
  const { name } = req;

  const villageApparatus = await VillageApparatus.findByPk(id);

  if (!req.files) {
    try {
      await villageApparatus.update(
        {
          nik,
          name: nama,
          place_birth,
          date_birth,
          status_married,
          task,
          address,
          position,
          updated_by: name,
          level,
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
    )}/public/village-apparatus/${filename}`;

    file.mv(`public/village-apparatus/${filename}`);

    if (villageApparatus.img !== null) {
      fs.unlinkSync(`public/village-apparatus/${villageApparatus.img}`);
    }

    try {
      await villageApparatus.update(
        {
          nik,
          name,
          place_birth,
          date_birth,
          status_married,
          task,
          address,
          position,
          updated_by: id_user,
          img: filename,
          path_img: pathImg,
          level,
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

export const deleteVillageApparatus = async (req, res) => {
  try {
    const { id } = req.params;

    const villageApparatus = await VillageApparatus.findByPk(id);

    if (villageApparatus.img !== null) {
      fs.unlinkSync(`public/village-apparatus/${villageApparatus.img}`);
    }

    villageApparatus.destroy();

    return res
      .status(200)
      .json({ message: 'Berhasil mengahpus village apparatus!' });
  } catch (error) {
    return res.status(500).json(error);
  }
};
