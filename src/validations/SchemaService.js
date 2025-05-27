import { z } from 'zod';

const schemaService = z.object({
  nama: z.string().min(1, 'jenis service tidak boleh kosong'),
  // name_concerned: z.string().min(1, 'Nama pengaju service tidak boleh kosong!'),
});

export { schemaService };
