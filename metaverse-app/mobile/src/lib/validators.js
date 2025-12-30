import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const registerSchema = z.object({
  email: z.string().email("Email tidak valid"),
});

export const forgotSchema = z.object({
  email: z.string().email("Email tidak valid"),
});

export const otpSchema = z.object({
  code: z.string().length(4, "OTP harus 4 digit"),
});

export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Minimal 8 karakter")
    .regex(/[a-z]/, "Wajib ada huruf kecil")
    .regex(/[A-Z]/, "Wajib ada huruf besar")
    .regex(/[0-9]/, "Wajib ada angka"),
  confirm: z.string(),
}).refine((v) => v.password === v.confirm, {
  message: "Konfirmasi password tidak sama",
  path: ["confirm"],
});

export const profileSchema = z.object({
  fullName: z.string().min(2, "Nama minimal 2 karakter"),
  nik: z.string().min(8, "NIK terlalu pendek").max(32, "NIK terlalu panjang"),
  birthDate: z.string().min(4, "Tanggal lahir wajib"),
  address: z.string().max(100, "Max 100 karakter").optional(),
});
