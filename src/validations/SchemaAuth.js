import { z } from 'zod';

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;

const loginSchema = z.object({
  email: z.string().nonempty({ message: 'Email tidak boleh kosong!' }),
  password: z.string().nonempty({ message: 'Password tidak boleh kosong!' }),
});

const registerSchema = z
  .object({
    fullname: z.string().nonempty({ message: 'Nama tidak boleh kosong!' }),
    email: z.string().nonempty({ message: 'Email tidak boleh kosong!' }),
    phone: z
      .string()
      .nonempty({ message: 'Nomor telepon tidak boleh kosong!' }),
    username: z
      .string()
      .regex(/^\S+$/, { message: 'Username tidak boleh mengandung spasi' })
      .nonempty({ message: 'Username tidak boleh kosong!' }),
    password: z
      .string()
      .regex(passwordRegex, {
        message:
          'Password harus mengandung huruf besar, huruf kecil, angka, dan simbol',
      })
      .min(8, { message: 'Password harus minimal 8 karakter' })
      .nonempty({ message: 'Password tidak boleh kosong!' }),
    confirmPassword: z
      .string()
      .nonempty({ message: 'Konfirmasi password tidak boleh kosong!' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok!',
    path: ['confirmPassword'],
  });

export { loginSchema, registerSchema };
