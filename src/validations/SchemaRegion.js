import { z } from 'zod';

const schemaRegion = z.object({
  name: z.string().nonempty('Name is required'),
  total_population: z
    .number()
    .int()
    .min(1, 'total population tidak boleh kosong!'),
  hectar_area: z.string().min(1, 'hektar are tidak boleh kosong!'),
  geo_polygon: z.string().min(1, 'geo polygon tidak boleh kosong!'), // Sesuaikan tipe jika perlu
  centroid_lat: z.string().min(1, 'latitude tidak boleh kosong!'),
  centroid_long: z.string().min(1, 'longitude tidak boleh kosong!'),
  map_color: z.string().min(1, 'warna map tidak boleh kosong!'),
});

export { schemaRegion };
