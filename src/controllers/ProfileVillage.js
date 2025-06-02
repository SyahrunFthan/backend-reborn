import ProfileVillage from '../models/ModelProfileVillage';

export const createProfileVillage = async (req, res) => {
  const {
    name_village,
    about,
    date,
    address,
    vision,
    mission,
    history,
    latitude,
    longitude,
  } = req.body;

  try {
  } catch (error) {
    return res.status(500).json(error);
  }
};
