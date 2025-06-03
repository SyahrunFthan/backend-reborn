import { z } from 'zod';

const schemaProfileVillage = z.object({
  name_village: z.string().min(1, 'name desa tidak boleh kosong !'),
  about: z.string().min(1, 'about tidak boleh kosong !'),
  date: z.string().min(1, 'date tidak boleh kosong !'),
  address: z.string().min(1, 'address tidak boleh kosong !'),
  vision: z.string().min(1, 'vision tidak boleh kosong !'),
  mission: z.string().min(1, 'mission tidak boleh kosong !'),
  history: z.string().optional(),
  latitude: z.string().min(1, 'latitude tidak boleh kosong !'),
  longitude: z.string().min(1, 'longitude tidak boleh kosong !'),
  central_lat: z.string().min(1, 'central_lat tidak boleh kosong !'),
  central_long: z.string().min(1, 'central_long tidak boleh kosong !'),
  polygon: z.string().min(1, 'polygon tidak boleh kosong !'),
  color_polygon: z.string().min(1, 'color_polygon tidak boleh kosong !'),
  path_json: z.string().optional(),
});
export { schemaProfileVillage };
