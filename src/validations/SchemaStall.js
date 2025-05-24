import { z } from 'zod';

const schemaStall = z.object({
  name_stall: z.string().min(1, 'Nama usaha tidak boleh kosong'),
  price: z.string().min(1, 'Harga tidak boleh kosong'),
  phone: z.string().min(1, 'Nomor handphone tidak boleh kosong'),
  address: z.string().min(1, 'Alamat tidak boleh kosong'),
  latitude: z.string().min(1, 'Latitude tidak boleh kosong'),
  longitude: z
    .string()
    .regex(/^-?\d+(\.\d+)?$/, 'Longitude harus berupa angka yang valid')
    .min(1, 'Longitude tidak boleh kosong'),
  stall_category_id: z.string().nonempty('Pilih kategori usaha.'),
  description: z.string().min(1, 'Deskripsi tidak boleh kosong'),
});

export { schemaStall };
