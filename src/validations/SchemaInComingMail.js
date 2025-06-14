import { z } from 'zod';

const schemaInComingMail = z.object({
  reference_number: z
    .string()
    .nonempty({ message: 'Nomor surat tidak boleh kosong.' }),
  date_latter: z.string().nonempty({ message: 'Inputan tidak boleh kosong.' }),
  date_received: z
    .string()
    .nonempty({ message: 'Inputan tidak boleh kosong.' }),
  sender: z.string().nonempty({ message: 'Inputan tidak boleh kosong.' }),
  regarding: z.string().nonempty({ message: 'Inputan tidak boleh kosong.' }),
  status_latter: z
    .string()
    .nonempty({ message: 'Inputan tidak boleh kosong.' }),
});

export default schemaInComingMail;
