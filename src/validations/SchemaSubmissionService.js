import { z } from 'zod';

const createSchema = z.object({
  name: z.string().nonempty('Nama harus diisi'),
  nik: z.string().min(16, 'NIK tidak sesuai!').nonempty('NIK harus diisi'),
  service_id: z.string().nonempty('Layanan harus diisi'),
});

export { createSchema };
