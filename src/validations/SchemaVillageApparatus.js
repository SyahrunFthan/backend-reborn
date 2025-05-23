import { z } from 'zod';

const schemaVillageApparatus = z.object({
  nik: z
    .string()
    .min(16, 'NIK harus 16 karakter')
    .max(16, 'NIK harus 16 karakter'),
  name: z.string().min(1, 'Nama tidak boleh kosong'),
  place_birth: z.string().min(1, 'Tempat lahir tidak boleh kosong'),
  //   date_birth: z.date(),
  status_married: z.enum(['belum menikah', 'menikah']),
  task: z.string().min(1, 'Tugas tidak boleh kosong'),
  address: z.string().min(1, 'Alamat tidak boleh kosong'),
  position: z.string().min(1, 'Posisi tidak boleh kosong'),
});

export { schemaVillageApparatus };
