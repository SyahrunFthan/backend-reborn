import { z } from 'zod';

const schemaRegion = z.object({
  name: z.string().nonempty('Name is required'),
  total_population: z
    .number()
    .min(1, 'Total penduduk tidak boleh kurang dari 1'),
  hectare_area: z.string().min(1, 'hektar are tidak boleh kosong!'),
  geo_polygon: z.string().nonempty('Polygon tidak boloh kosong'),
  map_color: z.string().min(1, 'warna map tidak boleh kosong!'),
  leader_id: z.string().min(1, 'id pimpinan tidak boleh kosong!'),
});

export { schemaRegion };
