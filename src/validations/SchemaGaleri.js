import { z } from 'zod';

const schemaGaleri = z.object({
  title: z.string().nonempty({ message: 'Title tidak boleh kosong!' }),
});

export { schemaGaleri };
