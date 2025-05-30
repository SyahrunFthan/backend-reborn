import { z } from 'zod';

const schemaService = z.object({
  title: z.string().min(1, 'title service tidak boleh kosong'),
  type_service: z.enum(['umum', 'penduduk', 'pertahanan', 'lainnya']),
});

export { schemaService };
