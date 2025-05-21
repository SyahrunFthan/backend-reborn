import Residents from "../models/ModelResidents.js";

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
  } = req.body;

  const checkResidents = await Residents.findOne({
    where: {
      nik: nik,
    },
  });

  if (checkResidents) {
    return res
      .status(401)
      .json({ message: "nik sudah terdatar di table penduduk" });
  }

  try {
    await Residents.create({
      nik: nik,
      no_kk: no_kk,
      place_birth: place_birth,
      date_birth: date_birth,
      gender: gender,
      status: status,
      religion: religion,
      education: education,
      work: work,
      age: age,
    });
    return res
      .status(201)
      .json({ message: "data penduduk berhasil tambahkan" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const updateResidents = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nik: nik,
      no_kk,
      place_birth,
      date_birth,
      gender,
      status,
      religion,
      education,
      work,
      age,
    } = req.body;

    const resident = await Residents.findByPk(id);

    if (!resident) {
      return res.status(404).json({ message: "Penduduk tidak ditemukan" });
    }

    await resident.update({
      nik: nik,
      no_kk: no_kk,
      place_birth: place_birth,
      date_birth: date_birth,
      gender: gender,
      status: status,
      religion: religion,
      education: education,
      work: work,
      age: age,
    });

    return res
      .status(200)
      .json({ message: "Data penduduk berhasil diperbarui" });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};

export const deleteResidents = async (req, res) => {
  const { id } = req.params;

  const resident = await Residents.findByPk(id);

  if (!resident) {
    return res.status(404).json({ message: "Penduduk tidak ditemukan" });
  }

  try {
    // Hapus data penduduk
    await resident.destroy({
      where: {
        uuid: id,
      },
    });

    return res.status(200).json({ message: "Data penduduk berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};
