import { z } from "zod";

// Form validations from the assignment:
// Name: Min 20, Max 60
// Address: Max 400
// Password: 8-16, include at least one uppercase and one special
// Email: standard email

const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

export const emailSchema = z.string().email("Invalid email");
export const nameSchema = z.string().min(20).max(60);
export const addressSchema = z.string().max(400);
export const passwordSchema = z.string().regex(passwordRegex, "Password must be 8-16 chars, include one uppercase & one special character.");

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema
});

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
  role: z.enum(["ADMIN", "USER", "STORE_OWNER"])
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1)
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: passwordSchema
});

export const createStoreSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  ownerUserId: z.string().uuid().nullable().optional()
});

export const ratingSchema = z.object({
  value: z.number().int().min(1).max(5)
});
