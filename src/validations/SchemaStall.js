import { z } from "zod";

const schemaStall = z.object({
  title: z.string().min(1, "Title tidak boleh kosong"),
  price: z.number().positive("Price must be a positive number"),
  name_seller: z.string().min(1, "nama penjual tidak boleh kosong"),
  phone: z.string().min(1, "nomor handphone tidak boleh kosong"),
  address: z.string().min(1, "address tidak boleh kosong"),
  latitude: z
    .string()
    .regex(/^-?\d+(\.\d+)?$/, "Latitude must be a valid number")
    .min(1, "latitude tidak boleh kosong"),
  longitude: z
    .string()
    .regex(/^-?\d+(\.\d+)?$/, "Longitude must be a valid number")
    .min(1, "longitude tidak boleh kosong"),
  category_id: z.string().min(1, "Category ID is required"),
});

export { schemaStall };
