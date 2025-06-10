import { Op } from 'sequelize';
import CitizensAssocation from '../models/ModelCitizensAssocation.js';
import Region from '../models/ModelRegion.js';

// Admin & User
export const getCitizensAssocation = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { rows: response, count: totalCitizenAssociation } =
      await CitizensAssocation.findAndCountAll({
        attributes: [
          'uuid',
          'rt_number',
          'rw_number',
          'rt_leader',
          'rw_leader',
          'total_kk',
          'total_population',
          'region_id',
        ],
        include: [
          {
            model: Region,
            as: 'region',
            foreignKey: 'region_id',
            attributes: ['uuid', 'name'],
          },
        ],
        where: {
          [Op.or]: [
            {
              rt_number: {
                [Op.like]: `%${search}%`,
              },
            },
            {
              rt_leader: {
                [Op.like]: `%${search}%`,
              },
            },
            {
              rw_leader: {
                [Op.like]: `%${search}%`,
              },
            },
            {
              rw_number: {
                [Op.like]: `%${search}%`,
              },
            },
          ],
        },
        offset: offset,
        limit: limit,
      });

    return res.status(200).json({
      response,
      pagination: {
        total: totalCitizenAssociation,
        page: page,
        totalPage: Math.ceil(totalCitizenAssociation / limit),
      },
    });
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

  const checlRtRwRegion = await CitizensAssocation.findAll({
    where: { rt_number: rt_number, rw_number: rw_number, region_id: region_id },
  });

  if (checlRtRwRegion.length > 0)
    return res.status(409).json({ message: 'RT/RW dan Dusun sudah ada.' });

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
