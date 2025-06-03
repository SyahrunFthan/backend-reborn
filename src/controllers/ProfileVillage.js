import Aparatus from '../models/ModelAparatus.js';
import ProfileVillage from '../models/ModelProfileVillage.js';
import path from 'path';
import Region from '../models/ModelRegion.js';
import CitizensAssocation from '../models/ModelCitizensAssocation.js';
import Residents from '../models/ModelResidents.js';

// ADMIN
export const getProfileVillage = async (req, res) => {
  try {
    const response = await ProfileVillage.findAll({
      attributes: [
        'uuid',
        'name_village',
        'latitude',
        'longitude',
        'polygon',
        'central_lat',
        'central_long',
        'color_polygon',
      ],
    });

    const leaders = await Aparatus.findOne({
      attributes: ['uuid', 'name', 'path_img'],
      where: { position: 'Kepala Desa' },
    });

    const regions = await Region.findAll({
      attributes: [
        'uuid',
        'leader_id',
        'total_population',
        'hectare_area',
        'geo_polygon',
        'map_color',
      ],
      include: [
        {
          model: Aparatus,
          as: 'leader',
          foreignKey: 'leader_id',
          attributes: ['name', 'path_img', 'img'],
        },
      ],
    });

    const totalRt = await CitizensAssocation.count({
      distinct: true,
      col: 'rt_number',
    });
    const totalRw = await CitizensAssocation.count({
      distinct: true,
      col: 'rw_number',
    });
    const totalPopulationVillage = await Residents.count();

    return res.status(200).json({
      villages: response[0],
      leaders,
      regions,
      totalRt,
      totalRw,
      totalPopulationVillage,
    });
  } catch (error) {
    return res.status(200).json(error);
  }
};

// ADMIN
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
    central_lat,
    central_long,
    polygon,
    color_polygon,
  } = req.body;

  if (!req.files)
    return res.status(422).json({ file: 'Gambar tidak boleh kosong.' });
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const allowedTypes = ['.png', '.jpg', '.jpeg'];
  const filename = Date.now() + ext;

  if (!allowedTypes.includes(ext.toLowerCase()))
    return res.status(422).json({ message: 'Format gambar tidak di dukung!' });

  if (fileSize > 3000000)
    return res.status(422).json({ message: 'Ukuran gambar terlalu besar!' });

  const pathFile = `${req.protocol}://${req.get(
    'host'
  )}/public/profile-village/${filename}`;

  file.mv(`public/profile-village/${filename}`);
  try {
    await ProfileVillage.create({
      name_village,
      about,
      date,
      address,
      vision,
      mission,
      history,
      latitude,
      longitude,
      central_lat,
      central_long,
      polygon,
      color_polygon,
      img: filename,
      path_img: pathFile,
    });

    return res
      .status(201)
      .json({ message: 'Berhasil Menambahkan Data Profile Desa!' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// ADMIN
export const updateProfileVillage = async (req, res) => {
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
    central_lat,
    central_long,
    polygon,
    color_polygon,
  } = req.body;

  const { id } = req.params;

  const profileVillage = await ProfileVillage.findByPk(id);

  if (!req.files) {
    try {
      await profileVillage.update(
        {
          name_village,
          about,
          date,
          address,
          vision,
          mission,
          history,
          latitude,
          longitude,
          central_lat,
          central_long,
          polygon,
          color_polygon,
        },
        {
          where: {
            uuid: id,
          },
        }
      );
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const allowedTypes = ['.png', '.jpg', '.jpeg'];
    const filename = Date.now() + ext;

    if (!allowedTypes.includes(ext.toLowerCase()))
      return res
        .status(422)
        .json({ message: 'Format gambar tidak di dukung!' });

    if (fileSize > 3000000)
      return res.status(422).json({ message: 'Ukuran gambar terlalu besar!' });

    const pathFile = `${req.protocol}://${req.get(
      'host'
    )}/public/profile-village/${filename}`;

    file.mv(`public/profile-village/${filename}`);

    if (profileVillage.img !== null) {
      fs.unlinkSync(`public/profile-village/${profileVillage.img}`);
    }
    try {
      await profileVillage.update(
        {
          name_village,
          about,
          date,
          address,
          vision,
          mission,
          history,
          latitude,
          longitude,
          central_lat,
          central_long,
          polygon,
          color_polygon,
          img: filename,
          path_img: pathFile,
        },
        {
          where: {
            uuid: id,
          },
        }
      );
    } catch (error) {
      return res.status(500).json(error);
    }
  }
};

// ADMIN
export const deleteProfileVillage = async (req, res) => {
  try {
    const { id } = req.params;

    const profileVillage = await ProfileVillage.findByPk(id);

    if (profileVillage.img !== null) {
      fs.unlinkSync(`public/proofile-village/${profileVillage.img}`);
    }

    profileVillage.destroy();

    return res
      .status(200)
      .json({ message: 'Berhasil Menghapu Profile Village' });
  } catch (error) {
    return res.status(500).json(error);
  }
};
