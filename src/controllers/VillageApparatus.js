import VillageApparatus from '../models/ModelVillageApparatus.js';
import path from 'path';

// Super Admin & Admin
export const createVillageApparatus = async (res, res) => {
  const {
    nik,
    name,
    place_birth,
    date_birth,
    gender,
    status,
    address,
    phone_number,
    position,
  } = req.body;

  const { id } = req.params;

  if (!req.files) return res.status(422).json({ message: 'Img harus di isi!' });

  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const allowedTypes = ['.png', '.jpg', '.jpeg'];
  const filename = Date.now() + ext;

  if (!allowedTypes.includes(ext.toLowerCase()))
    return res.status(422).json({ message: 'Format img tidak di dukung!' });
  if (fileSize > 300000)
    return res.status(422).json({ message: 'Ukuran img terlalu besar!' });

  file.mv(`public/VillageApparatus/${filename}`);
  const pathImg = `${req.protocol}://${req.get(
    'host'
  )}/public/VillageApparatus/${filename}`;
  try {
    await VillageApparatus.create({
      nik: nik,
      name: name,
      place_birth: place_birth,
      date_birth: date_birth,
      gender: gender,
      status: status,
      address: address,
      phone_number: phone_number,
      position: position,
      img: filename,
      path_img: pathImg,
    });

    return res.status(201).json({
      message: 'berhasil menambahkan pegawai desa (village apparatus)!',
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
