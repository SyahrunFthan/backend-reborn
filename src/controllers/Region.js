import { Op, Sequelize } from 'sequelize';
import CitizensAssocation from '../models/ModelCitizensAssocation.js';
import Region from '../models/ModelRegion.js';
import Residents from '../models/ModelResidents.js';
import ProfileVillage from '../models/ModelProfileVillage.js';
import Aparatus from '../models/ModelAparatus.js';

// Admin
export const getRegionForForm = async (req, res) => {
  try {
    const response = await Region.findAll({
      attributes: ['uuid', 'name'],
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error);
  }
};
// All Role
export const getRegion = async (req, res) => {
  try {
    const search = req.query.search || '';
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const totalRegions = await Region.count({
      where: {
        name: {
          [Op.like]: `%${search}%`,
        },
      },
    });

    const regions = await Region.findAll({
      attributes: [
        'uuid',
        'name',
        'leader_id',
        'total_population',
        'hectare_area',
        'geo_polygon',
        'map_color',
        [
          Sequelize.fn(
            'COUNT',
            Sequelize.fn(
              'DISTINCT',
              Sequelize.col('citizens_assocation.rt_number')
            )
          ),
          'total_rt',
        ],
        [
          Sequelize.fn(
            'COUNT',
            Sequelize.fn(
              'DISTINCT',
              Sequelize.col('citizens_assocation.rw_number')
            )
          ),
          'total_rw',
        ],
        [
          Sequelize.fn(
            'COUNT',
            Sequelize.fn('DISTINCT', Sequelize.col('residents.region_id'))
          ),
          'total_population_region',
        ],
      ],
      include: [
        {
          model: CitizensAssocation,
          as: 'citizens_assocation',
          foreignKey: 'region_id',
          attributes: [],
        },
        {
          model: Aparatus,
          as: 'leader',
          attributes: ['uuid', 'name', 'position', 'path_img'],
        },
        {
          model: Residents,
          as: 'residents',
          foreignKey: 'region_id',
          attributes: [],
        },
      ],
      group: ['regions.uuid'],
      where: {
        name: {
          [Op.like]: `%${search}%`,
        },
      },
      offset: offset,
      limit: limit,
      subQuery: false,
    });

    return res.status(200).json({
      data: regions,
      pagination: {
        total: totalRegions,
        page: page,
        totalPage: Math.ceil(totalRegions / limit),
      },
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
// all role
export const getRegionAndVillage = async (req, res) => {
  try {
    const response = await Region.findAll({
      attributes: [
        'uuid',
        'name',
        'leader_id',
        'total_population',
        'hectare_area',
        'geo_polygon',
        'map_color',
        [
          Sequelize.fn(
            'COUNT',
            Sequelize.fn(
              'DISTINCT',
              Sequelize.col('citizens_assocation.rt_number')
            )
          ),
          'total_rt',
        ],
        [
          Sequelize.fn(
            'COUNT',
            Sequelize.fn(
              'DISTINCT',
              Sequelize.col('citizens_assocation.rw_number')
            )
          ),
          'total_rw',
        ],
        [
          Sequelize.fn(
            'COUNT',
            Sequelize.fn('DISTINCT', Sequelize.col('residents.region_id'))
          ),
          'total_population_region',
        ],
      ],
      include: [
        {
          model: CitizensAssocation,
          as: 'citizens_assocation',
          foreignKey: 'region_id',
          attributes: [],
        },
        {
          model: Residents,
          as: 'residents',
          foreignKey: 'region_id',
          attributes: [],
        },
        {
          model: Aparatus,
          as: 'leader',
          foreignKey: 'leader_id',
          attributes: ['uuid', 'name', 'position', 'path_img'],
        },
      ],
      group: ['regions.uuid'],
    });

    const villages = await ProfileVillage.findAll({
      attributes: ['central_lat', 'central_long'],
    });

    return res.status(200).json({ response, villages: villages[0] });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Admin
export const createRegion = async (req, res) => {
  const {
    name: nameRegion,
    total_population,
    hectare_area,
    geo_polygon,
    map_color,
    leader_id,
  } = req.body;
  const { name } = req;

  const checkLeader = await Region.findAll({
    where: {
      leader_id,
    },
  });

  if (checkLeader.length > 0)
    return res
      .status(409)
      .json({ message: 'Kepala dusun ini sudah memiliki dusun.' });

  try {
    await Region.create({
      leader_id,
      total_population,
      hectare_area,
      geo_polygon,
      map_color,
      name: nameRegion,
      created_by: name,
    });

    return res.status(201).json({ message: 'Berhasil Menambah Region' });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// Admin
export const updateRegion = async (req, res) => {
  const {
    name: nameRegion,
    total_population,
    hectare_area,
    geo_polygon,
    map_color,
    leader_id,
  } = req.body;
  const { name } = req;
  const { id } = req.params;

  const region = await Region.findByPk(id);

  const isUsed = await Region.findOne({
    where: { leader_id, uuid: { [Op.ne]: id } },
  });

  if (isUsed)
    return res.status(409).json({
      message: 'Aparatur ini sudah digunakan sebagai pemimpin wilayah lain',
    });

  try {
    await region.update({
      name: nameRegion,
      leader_id,
      total_population,
      hectare_area,
      geo_polygon,
      map_color,
      updated_by: name,
    });

    return res
      .status(200)
      .json({ message: 'Berhasil mengupdate data Region!' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Admin
export const deleteRegion = async (req, res) => {
  try {
    const { id } = req.params;

    const region = await Region.findByPk(id);

    await region.destroy();

    return res.status(200).json({ message: 'Berhasil Menghapus Region!' });
  } catch (error) {
    return res.status(500).json(500);
  }
};
