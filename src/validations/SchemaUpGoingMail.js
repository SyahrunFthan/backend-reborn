import { z } from 'zod';

const schemaUpGoingMail = z.object({
  reference_number: z
    .string()
    .nonempty({ message: 'Nomor surat tidak boleh kosong.' }),
  date_latter: z.string().nonempty({ message: 'Inputan tidak boleh kosong.' }),
  objective: z.string().nonempty({ message: 'Inputan tidak boleh kosong.' }),
  regarding: z.string().nonempty({ message: 'Inputan tidak boleh kosong.' }),
  status_latter: z
    .string()
    .nonempty({ message: 'Inputan tidak boleh kosong.' }),
});

export default schemaUpGoingMail;
