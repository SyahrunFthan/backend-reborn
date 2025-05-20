import { z } from "zod";

const schemaRole = z.object({
  role_name: z.string(),
  key_role: z.string(),
});

export { schemaRole };
