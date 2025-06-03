import CitizensAssocation from '../models/ModelCitizensAssocation.js';
import Region from '../models/ModelRegion.js';

// Admin & User
export const getCitizensAssocation = async (req, res) => {
  try {
    const response = await CitizensAssocation.findAll({
      attributes: [
        'uuid',
        'rt_number',
        'rw_number',
        'rt_leader',
        'rw_leader',
        'total_kk',
        'total_population',
      ],
      include: [
        {
          model: Region,
          as: 'region',
          attributes: ['uuid', 'name'],
        },
      ],
    });

    if (response.length == 0)
      return res.status(404).json({ message: 'Data Not Found.' });

    return res.status(200).json({ response });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Admin & User
export const getCitizensAssocationById = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await CitizensAssocation.findByPk(id, {
      attributes: [
        'uuid',
        'region_id',
        'rt_number',
        'rw_number',
        'rt_leader',
        'rw_leader',
        'total_kk',
        'total_population',
      ],
    });

    if (response.length == 0)
      return res.status(404).json({ message: 'Data Not Found.' });

    return res.status(200).json({ response });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Admin
export const createCitizensAssociation = async (req, res) => {
  const {
    region_id,
    rt_number,
    rw_number,
    rt_leader,
    rw_leader,
    total_kk,
    total_population,
  } = req.body;
  const { userId } = req;

  const checkRegion = await Region.findByPk(region_id);

  if (!checkRegion) {
    return res.status(404).json({ message: 'region tidak di temukan!' });
  }

  try {
    await CitizensAssocation.create({
      region_id,
      rt_number,
      rw_number,
      rt_leader,
      rw_leader,
      total_kk,
      total_population,
      created_by: userId,
    });

    return res
      .status(201)
      .json({ message: 'Berhasil Menambahkan Citizen Association!' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Admin
export const updateCitizenAssociation = async (req, res) => {
  const {
    region_id,
    rt_number,
    rw_number,
    rt_leader,
    rw_leader,
    total_kk,
    total_population,
  } = req.body;
  const { userId } = req;
  const { id } = req.params;

  const citizensAssocation = await CitizensAssocation.findByPk(id);

  if (!citizensAssocation) {
    return res
      .status(404)
      .json({ message: 'data citizen association tidak di temukan!' });
  }

  try {
    await citizensAssocation.update({
      region_id,
      rt_number,
      rw_number,
      rt_leader,
      rw_leader,
      total_kk,
      total_population,
      updated_by: userId,
    });

    return res
      .status(200)
      .json({ message: 'Berhasil Mengubah data citizen association!' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Admin
export const deleteCitizenAssociation = async (req, res) => {
  try {
    const { id } = req.params;

    const citizensAsociation = await CitizensAssocation.findByPk(id);

    await citizensAsociation.destroy();

    return res
      .status(200)
      .json({ message: 'Berhasil Menghapus Citizen Association!' });
  } catch (error) {
    return res.status(500).json(error);
  }
};
