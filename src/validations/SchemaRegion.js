import { z } from 'zod';

const schemaRegion = z.object({
  name: z.string().nonempty('Name is required'),
  total_population: z
    .number()
    .min(1, 'Total penduduk tidak boleh kurang dari 1'),
  hectare_area: z.string().min(1, 'hektar are tidak boleh kosong!'),
  geo_polygon: z.string().nonempty('Polygon tidak boloh kosong'),
  centroid_lat: z
    .number({ invalid_type_error: 'latitude harus berupa angka' })
    .min(-90, 'latitude minimal -90')
    .max(90, 'latitude maksimal 90'),

  centroid_long: z
    .number({ invalid_type_error: 'longitude harus berupa angka' })
    .min(-180, 'longitude minimal -180')
    .max(180, 'longitude maksimal 180'),
  map_color: z.string().min(1, 'warna map tidak boleh kosong!'),
  leader_id: z.string().min(1, 'id pimpinan tidak boleh kosong!'),
});

export { schemaRegion };
