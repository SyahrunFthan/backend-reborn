import { z } from 'zod';

const schemaResidents = z.object({
  nik: z.string().nonempty({ message: 'NIK tidak boleh kosong!' }),
  no_kk: z.string().nonempty({ message: 'Nomor KK tidak boleh kosong!' }),
  place_birth: z
    .string()
    .nonempty({ message: 'Tempat lahir tidak boleh kosong!' }),
  // date_birth: z.date().refine((date) => date <= new Date(), {
  //   message: "Tanggal lahir tidak boleh di masa depan!",
  // }),
  gender: z.enum(['L', 'P'], { message: "Gender harus 'L' atau 'P'!" }),
  status: z.string().nonempty({ message: 'Status tidak boleh kosong!' }),
  religion: z.string().nonempty({ message: 'Agama tidak boleh kosong!' }),
  education: z.string().nonempty({ message: 'Pendidikan tidak boleh kosong!' }),
  work: z.string().nonempty({ message: 'Pekerjaan tidak boleh kosong!' }),
  age: z.number().int().min(0, { message: 'Usia harus berupa angka positif!' }),
});

export { schemaResidents };
