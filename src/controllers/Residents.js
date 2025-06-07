import { Op } from 'sequelize';
import CitizensAssocation from '../models/ModelCitizensAssocation.js';
import Region from '../models/ModelRegion.js';
import Residents from '../models/ModelResidents.js';
import decrypt from '../utils/decryption.js';
import encrypt from '../utils/encryption.js';
import path from 'path';
import fs from 'fs';

// Admin & Fix
export const getRegionForm = async (req, res) => {
  try {
    const citizensAssociation = await CitizensAssocation.findAll({
      attributes: ['uuid', 'rt_number', 'rw_number', 'region_id'],
      include: [
        {
          model: Region,
          as: 'region',
          foreignKey: 'region_id',
          attributes: ['uuid', 'name'],
        },
      ],
    });

    return res.status(200).json({ response: citizensAssociation });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Admin
export const getResidents = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { rows: residents, count } = await Residents.findAndCountAll({
      attributes: [
        'uuid',
        'name',
        'nik',
        'place_birth',
        'date_birth',
        'gender',
        'citizen_status',
        'region_id',
        'rt_rw_id',
      ],
      include: [
        {
          model: CitizensAssocation,
          as: 'rt_rw',
          attributes: ['rt_number', 'rw_number'],
        },
        {
          model: Region,
          as: 'region',
          attributes: ['name'],
        },
      ],
      offset: offset,
      limit: limit,
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            nik: {
              [Op.like]: `%${encrypt(search)}%`,
            },
          },
        ],
      },
    });

    const response = residents.map((item, index) => {
      const data = item.get({ plain: true });
      return {
        ...data,
        key: index,
        nik: decrypt(data.nik),
      };
    });

    const totalPage = Math.ceil(count / limit);

    return res.status(200).json({ response, totalPage, totalRow: count });
  } catch (error) {
    return res.status(500).json(error);
  }
};
// Admin & User
export const getResidentsById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Residents.findByPk(id, {
      attributes: [
        'uuid',
        'name',
        'nik',
        'no_kk',
        'place_birth',
        'date_birth',
        'gender',
        'status_married',
        'religion',
        'education',
        'work',
        'age',
        'citizen_status',
      ],
      include: [
        {
          model: CitizensAssocation,
          as: 'rt_rw',
          attributes: ['rt_number', 'rw_number'],
        },
        {
          model: Region,
          as: 'region',
          attributes: ['name'],
        },
      ],
    });

    return res.status(200).json({ response });
  } catch (error) {
    return res.status(500).json(500);
  }
};
// Admin & Fix
export const createResidents = async (req, res) => {
  const {
    nik,
    no_kk,
    name: nameResident,
    place_birth,
    date_birth,
    gender,
    status,
    religion,
    education,
    work,
    age,
    citizen_status,
    rt_rw_id,
    region_id,
    address,
  } = req.body;
  const { name } = req;

  const encryptNik = encrypt(String(nik));
  const encryptKK = encrypt(String(no_kk));

  const checkResidents = await Residents.findOne({
    where: {
      nik: encryptNik,
    },
  });

  if (checkResidents) {
    return res
      .status(409)
      .json({ message: 'Nik sudah terdatar di tabel penduduk' });
  }

  if (!req.files)
    return res.status(422).json({ message: 'Gambar harus diisi.' });

  const file = req.files.file;
  const filesize = file.data.length;
  const ext = path.extname(file.name);
  const allowedTypes = ['.png', '.jpg', '.jpeg'];
  const filename = Date.now() + ext;

  if (!allowedTypes.includes(ext.toLowerCase()))
    return res.status(422).json({ message: 'File harus berupa gambar' });
  if (filesize > 3000000)
    return res.status(422).json({ message: 'Ukuran gambar terlalu besar' });

  file.mv(`public/residents/${filename}`);

  const pathFile = `${req.protocol}://${req.get(
    'host'
  )}/public/residents/${filename}`;

  try {
    await Residents.create({
      place_birth,
      date_birth,
      gender,
      religion,
      education,
      work,
      age,
      citizen_status,
      rt_rw_id,
      region_id,
      address,
      image: filename,
      path_image: pathFile,
      name: nameResident,
      nik: encryptNik,
      no_kk: encryptKK,
      status_married: status,
      created_by: name,
    });
    return res
      .status(201)
      .json({ message: 'data penduduk berhasil tambahkan' });
  } catch (error) {
    return res.status(500).json(error);
  }
};
// Admin
export const updateResidents = async (req, res) => {
  const { id } = req.params;
  const {
    nik,
    no_kk,
    name: nameResident,
    place_birth,
    date_birth,
    gender,
    status,
    religion,
    education,
    work,
    age,
    citizen_status,
    rt_rw_id,
    region_id,
    address,
  } = req.body;
  const { name } = req;

  const encryptNik = encrypt(String(nik));
  const encryptKK = encrypt(String(no_kk));

  const resident = await Residents.findByPk(id);

  if (!resident) {
    return res.status(404).json({ message: 'Penduduk tidak ditemukan' });
  }

  if (!req.files) {
    try {
      await resident.update({
        nik,
        no_kk,
        name: nameResident,
        place_birth,
        date_birth,
        gender,
        status_married: status,
        religion,
        education,
        work,
        age,
        citizen_status,
        rt_rw_id,
        region_id,
        updated_by: name,
        address,
      });

      return res
        .status(200)
        .json({ message: 'Berhasil Mengubah Data Residents!' });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    const file = req.files.file;
    const filesize = file.data.length;
    const ext = path.extname(file.name);
    const allowedTypes = ['.png', '.jpg', '.jpeg'];
    const filename = Date.now() + ext;

    if (!allowedTypes.includes(ext.toLowerCase()))
      return res.status(422).json({ message: 'File harus berupa gambar' });
    if (filesize > 3000000)
      return res.status(422).json({ message: 'Ukuran gambar terlalu besar' });

    file.mv(`public/residents/${filename}`);

    const pathFile = `${req.protocol}://${req.get(
      'host'
    )}/public/residents/${filename}`;
    try {
      await resident.update({
        place_birth,
        date_birth,
        gender,
        religion,
        education,
        work,
        age,
        citizen_status,
        rt_rw_id,
        region_id,
        address,
        image: filename,
        path_image: pathFile,
        name: nameResident,
        nik: encryptNik,
        no_kk: encryptKK,
        status_married: status,
        created_by: name,
      });

      return res
        .status(200)
        .json({ message: 'Berhasil Mengubah Data Resident!' });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
};
// Admin
export const deleteResidents = async (req, res) => {
  const { id } = req.params;

  const resident = await Residents.findOne({
    where: {
      uuid: id,
    },
  });

  if (!resident) {
    return res.status(404).json({ message: 'Penduduk tidak ditemukan' });
  }
  if (resident.image !== null) {
    fs.unlinkSync(`public/residents/${resident.image}`);
  }
  try {
    await resident.destroy();

    return res.status(200).json({ message: 'Data penduduk berhasil dihapus' });
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi kesalahan', error });
  }
};
