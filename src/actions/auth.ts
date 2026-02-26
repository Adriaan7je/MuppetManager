"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function login(formData: { username: string; password: string }) {
  try {
    await signIn("credentials", {
      username: formData.username,
      password: formData.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid username or password" };
    }
    throw error;
  }
  redirect("/dashboard");
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
