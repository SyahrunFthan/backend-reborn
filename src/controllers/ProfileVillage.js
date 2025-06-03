import ProfileVillage from '../models/ModelProfileVillage.js';
import path from 'path';

// ADMIN
export const getProfileVillage = async (req, res) => {
  try {
    const response = await ProfileVillage.findAll({
      attributes: [
        'uuid',
        'name_village',
        'about',
        'about',
        'date',
        'img',
        'path_img',
        'address',
        'vision',
        'mission',
        'history',
        'latitude',
        'longitude',
        'polygon',
        'central_lat',
        'central_long',
        'color_polygon',
      ],
    });

    return res.status(200).json({});
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
