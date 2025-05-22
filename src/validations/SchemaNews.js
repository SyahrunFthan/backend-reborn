import { z } from 'zod';

const schemaNews = z.object({
  title: z.string().nonempty({ message: 'title tidak boleh kosong!' }),
});

export { schemaNews };
