import { z } from 'zod';

const schemaCitizenAssociation = z.object({
  //   region_id: z.string().min(1, 'Region ID tidak boleh kosong.'),
  rt_number: z.string().min(1, 'Nomor RT tidak boleh kosong.'),
  rw_number: z.string().min(1, 'Nomor RW tidak boleh kosong.'),
  rt_leader: z.string().min(1, 'Nama ketua RT tidak boleh kosong.'),
  rw_leader: z.string().min(1, 'Nama ketua RW tidak boleh kosong.'),
  total_kk: z
    .number()
    .int()
    .nonnegative('Total KK harus berupa angka positif.'),
  total_population: z
    .number()
    .int()
    .nonnegative('Total populasi harus berupa angka positif.'),
});

export default schemaCitizenAssociation;
