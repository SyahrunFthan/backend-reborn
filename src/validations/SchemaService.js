import { z } from 'zod';

const schemaService = z.object({
  title: z.string().nonempty('Nama layanan tidak boleh kosong!'),
  type_service: z.string().nonempty('Pilih jenis layanan!'),
});

export { schemaService };
