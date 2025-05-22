import { z } from 'zod';

const schemaRole = z.object({
  role_name: z.string(),
  role_key: z.string(),
});

export { schemaRole };
