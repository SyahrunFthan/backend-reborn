import { z } from 'zod';

const schemaNews = z.object({
  title: z.string().nonempty({ message: 'title tidak boleh kosong!' }),
  description: z
    .string()
    .nonempty({ message: 'description tidak boleh kosong!' }),
});

export { schemaNews };
