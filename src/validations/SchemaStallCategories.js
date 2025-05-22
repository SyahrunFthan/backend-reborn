import { z } from 'zod';

const schemaStallCategories = z.object({
  title: z.string().nonempty({ message: 'Nama kategori tidak boleh kosong!' }),
});

export { schemaStallCategories };
