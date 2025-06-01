import CitizensAssocation from '../models/ModelCitizensAssocation.js';
import Region from '../models/ModelRegion.js';
import Residents from '../models/ModelResidents.js';
import encrypt from '../utils/encryption.js';
import descrypt from '../utils/decryption.js';

// Admin & User
export const getResidents = async (req, res) => {
  try {
    const response = await Residents.findAll({
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
// Admin
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
  } = req.body;
  const { name } = req;

  const checkResidents = await Residents.findOne({
    where: {
      nik: nik,
    },
  });

  if (checkResidents) {
    return res
      .status(401)
      .json({ message: 'nik sudah terdatar di table penduduk' });
  }

  const encryptNik = encrypt(nik);
  const encryptKK = encrypt(no_kk);

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
  try {
    const { id } = req.params;
    const {
      nik,
      no_kk,
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
    } = req.body;
    const { name } = req;

    const resident = await Residents.findByPk(id);

    if (!resident) {
      return res.status(404).json({ message: 'Penduduk tidak ditemukan' });
    }

    await resident.update({
      nik,
      no_kk,
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
    });

    return res
      .status(200)
      .json({ message: 'Data penduduk berhasil diperbarui' });
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi kesalahan', error });
  }
};
// Admin
export const deleteResidents = async (req, res) => {
  const { id } = req.params;

  const resident = await Residents.findByPk(id);

  if (!resident) {
    return res.status(404).json({ message: 'Penduduk tidak ditemukan' });
  }

  try {
    // Hapus data penduduk
    await resident.destroy({
      where: {
        uuid: id,
      },
    });

    return res.status(200).json({ message: 'Data penduduk berhasil dihapus' });
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi kesalahan', error });
  }
};
