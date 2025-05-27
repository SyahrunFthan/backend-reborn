import Region from '../models/ModelRegion.js';
import VillageApparatus from '../models/ModelAparatus.js';

export const createRegion = async (req, res) => {
  const {
    name,
    total_population,
    hectar_area,
    geo_polygon,
    centroid_lat,
    centroid_long,
    map_color,
  } = req.body;
  const { userId } = req;

  const checkLeader = await VillageApparatus.findOne({
    where: {
      level: 1,
    },
  });

  const leader_id = checkLeader.uuid;

  try {
    await Region.create({
      name,
      leader_id,
      total_population,
      hectar_area,
      geo_polygon,
      centroid_lat,
      centroid_long,
      map_color,
      created_by: userId,
    });

    return res.status(201).json({ message: 'Berhasil Menambah Region' });
  } catch (error) {
    return res.status(500).json(error);
  }
};
