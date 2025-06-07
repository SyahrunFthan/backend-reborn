import { z } from 'zod';

const schemaResidents = z.object({
  nik: z.string().nonempty({ message: 'NIK tidak boleh kosong!' }),
  name: z.string().nonempty({ message: 'Nama tidak boleh kosong!' }),
  no_kk: z.string().nonempty({ message: 'Nomor KK tidak boleh kosong!' }),
  place_birth: z
    .string()
    .nonempty({ message: 'Tempat lahir tidak boleh kosong!' }),
  date_birth: z
    .string()
    .nonempty({ message: 'Tanggal lahir tidak boleh kosong!' }),
  gender: z.enum(['L', 'P'], { message: "Gender harus 'L' atau 'P'!" }),
  status: z
    .string()
    .nonempty({ message: 'Status pernikahan tidak boleh kosong!' }),
  religion: z.string().nonempty({ message: 'Agama tidak boleh kosong!' }),
  education: z.string().nonempty({ message: 'Pendidikan tidak boleh kosong!' }),
  work: z.string().nonempty({ message: 'Pekerjaan tidak boleh kosong!' }),
  age: z.string().nonempty({ message: 'Usia tidak boleh kosong!' }),
  citizen_status: z
    .string()
    .nonempty({ message: 'Status penduduk tidak boleh kosong!' }),
  address: z.string().nonempty({ message: 'Alamat tidak boleh kosong!' }),
});

export { schemaResidents };
