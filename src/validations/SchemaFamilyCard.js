import { z } from 'zod';

const schemaFamilyCard = z.object({
  family_card_number: z
    .string()
    .min(1, { message: 'Family card number tidak boleh kosong' }),
  name: z.string().min(1, { message: 'Nama tidak boleh kosong!' }),
  nik: z.string().length(16, { message: 'NIK harus 16 karakter' }),
  status: z.enum(['kepala keluarga', 'anggota keluarga'], {
    message: "Status harus 'kepala keluarga' atau 'anggota keluarga'",
  }),
});

export { schemaFamilyCard };
