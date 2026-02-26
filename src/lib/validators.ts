import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const addPlayerSchema = z.object({
  squadId: z.string().min(1),
  playerId: z.number().int().positive(),
  slotType: z.enum(["FIRST_XI", "BENCH", "RESERVES"]),
  slotIndex: z.number().int().min(0),
});

export const removePlayerSchema = z.object({
  squadId: z.string().min(1),
  squadPlayerId: z.string().min(1),
});

export const updateFormationSchema = z.object({
  squadId: z.string().min(1),
  formation: z.string().min(1),
});

export const updateSettingsSchema = z.object({
  firstXIBudget: z.number().positive(),
  benchBudget: z.number().positive(),
  reservesBudget: z.number().positive(),
  costBase: z.number().positive(),
  costExponent: z.number().positive(),
  costBaseRating: z.number().int(),
});

export const swapSlotsSchema = z.object({
  squadId: z.string().min(1),
  fromIndex: z.number().int().min(0).max(10),
  toIndex: z.number().int().min(0).max(10),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});
