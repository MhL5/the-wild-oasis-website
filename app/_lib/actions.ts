"use server";

import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";

export async function updateGuest(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  let nationalityCountryFlag = formData.get("nationality");
  if (typeof nationalityCountryFlag !== "string" || !nationalityCountryFlag)
    throw new Error("invalid nationality");
  const [nationality, countryFlag] = nationalityCountryFlag.split("%");

  const nationalID = formData.get("nationalID");
  if (!/^[a-zA-Z0-9]{6,12}$/.test(String(nationalID)))
    throw new Error("Please provide a valid nationalID");

  const updateData = { nationality, countryFlag, nationalID };

  const { error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
