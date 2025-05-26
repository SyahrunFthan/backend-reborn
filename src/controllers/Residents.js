import Residents from '../models/ModelResidents.js';
import Users from '../models/ModelUsers.js';

export const getResidents = async (req, res) => {
  try {
    const residents = await Residents.findAll();
    return res.status(200).json({ residents });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const createResidents = async (req, res) => {
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

  try {
    await Residents.create({
      nik,
      no_kk,
      place_birth ,
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
      created_by: name,
    });
    return res
      .status(201)
      .json({ message: 'data penduduk berhasil tambahkan' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

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
      place_birth ,
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
      updated_by: name,
    });

    return res
      .status(200)
      .json({ message: 'Data penduduk berhasil diperbarui' });
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi kesalahan', error });
  }
};

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
