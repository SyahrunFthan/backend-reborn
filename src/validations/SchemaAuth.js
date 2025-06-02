import { z } from 'zod';
import { email } from 'zod/v4';

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;

const loginSchema = z.object({
  email: z.string().min(1, 'Email tidak boleh kosong!'),
  password: z.string().nonempty({ message: 'Password tidak boleh kosong!' }),
});

const loginWebSchema = z.object({
  username: z.string().min(1, 'username tidak boleh kosong!'),
  password: z.string().nonempty({ message: 'Password tidak boleh kosong!' }),
});

const registerSchema = z
  .object({
    fullname: z.string().nonempty({ message: 'Nama tidak boleh kosong!' }),
    email: z
      .string()
      .email()
      .nonempty({ message: 'Email tidak boleh kosong!' }),
    phone: z
      .string()
      .nonempty({ message: 'Nomor telepon tidak boleh kosong!' }),
    username: z.string().min(5, 'Username harus tepat 5 karakter '),
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

const registerWebSchema = z
  .object({
    fullname: z.string().nonempty({ message: 'Nama tidak boleh kosong!' }),
    email: z
      .string()
      .email()
      .nonempty({ message: 'Email tidak boleh kosong!' }),
    phone: z
      .string()
      .nonempty({ message: 'Nomor telepon tidak boleh kosong!' }),
    username: z.string().min(1, { message: 'username tidak boleh kosong!' }),
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

const checkNikSchema = z.object({
  nik: z
    .string()
    .min(16, 'NIK harus min 16 angka!')
    .nonempty({ message: 'NIK tidak boleh kosong' }),
});

export {
  loginSchema,
  loginWebSchema,
  registerSchema,
  registerWebSchema,
  checkNikSchema,
};
