import CitizensAssocation from '../models/ModelCitizensAssocation';

export const getCitizensAssocation = async (req, res) => {
  try {
    const response = await CitizensAssocation.findAll();

    if (response.length == 0)
      return res.status(404).json({ message: 'Data Not Found.' });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error);
  }
};
