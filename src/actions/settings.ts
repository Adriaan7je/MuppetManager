"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateSettingsSchema, changePasswordSchema } from "@/lib/validators";
import { hash, compare } from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function updateGameSettings(formData: {
  firstXIBudget: number;
  benchBudget: number;
  reservesBudget: number;
  costBase: number;
  costExponent: number;
  costBaseRating: number;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = updateSettingsSchema.parse(formData);

  await db.gameSettings.update({
    where: { id: "singleton" },
    data,
  });

  revalidatePath("/squad");
  revalidatePath("/dashboard");
  revalidatePath("/settings");
  return { success: true };
}

export async function changePassword(formData: {
  currentPassword: string;
  newPassword: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = changePasswordSchema.parse(formData);

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("User not found");

  const isValid = await compare(data.currentPassword, user.passwordHash);
  if (!isValid) return { error: "Current password is incorrect" };

  const newHash = await hash(data.newPassword, 12);
  await db.user.update({
    where: { id: user.id },
    data: { passwordHash: newHash },
  });

  return { success: true };
}
