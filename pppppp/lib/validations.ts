import { z } from "zod"

export const signupSchema = z.object({
  name: z.string().min(20, "Name must be at least 20 characters").max(60, "Name must not exceed 60 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must not exceed 16 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/,
      "Password must contain at least one uppercase letter and one special character",
    ),
  address: z.string().max(400, "Address must not exceed 400 characters"),
})

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must not exceed 16 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/,
      "Password must contain at least one uppercase letter and one special character",
    ),
})

export const storeSchema = z.object({
  name: z.string().min(1, "Store name is required").max(100, "Store name must not exceed 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  address: z.string().max(400, "Address must not exceed 400 characters"),
  ownerName: z
    .string()
    .min(20, "Owner name must be at least 20 characters")
    .max(60, "Owner name must not exceed 60 characters"),
  ownerPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must not exceed 16 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/,
      "Password must contain at least one uppercase letter and one special character",
    ),
})

export const userSchema = z.object({
  name: z.string().min(20, "Name must be at least 20 characters").max(60, "Name must not exceed 60 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must not exceed 16 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/,
      "Password must contain at least one uppercase letter and one special character",
    ),
  address: z.string().max(400, "Address must not exceed 400 characters"),
  role: z.enum(["ADMIN", "USER"]),
})

export const ratingSchema = z.object({
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must not exceed 5"),
  storeId: z.string().min(1, "Store ID is required"),
})
