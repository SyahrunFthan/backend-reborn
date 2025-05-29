import Region from '../models/ModelRegion.js';

// all role
export const getRegion = async (req, res) => {
  try {
    const response = await Region.findAll({
      attributes: [
        'uuid',
        'name',
        'leader_id',
        'total_population',
        'hectare_area',
        'geo_polygon',
        'centroid_lat',
        'centroid_long',
        'map_color',
      ],
    });

    return res.status(200).json({ response });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// all role
export const getRegionById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Region.findByPk(id, {
      attributes: [
        'uuid',
        'name',
        'leader_id',
        'total_population',
        'hectare_area',
        'geo_polygon',
        'centroid_lat',
        'centroid_long',
        'map_color',
      ],
    });

    return res.status(200).json({ response });
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
    centroid_lat,
    centroid_long,
    map_color,
    leader_id,
  } = req.body;
  const { name } = req;

  try {
    await Region.create({
      leader_id,
      total_population,
      hectare_area,
      geo_polygon,
      centroid_lat,
      centroid_long,
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
    centroid_lat,
    centroid_long,
    map_color,
    leader_id,
  } = req.body;
  const { name } = req;
  const { id } = req.params;

  const region = await Region.findByPk(id);

  try {
    await region.update({
      name: nameRegion,
      leader_id,
      total_population,
      hectare_area,
      geo_polygon,
      centroid_lat,
      centroid_long,
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
