import Region from '../models/ModelRegion.js';

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
