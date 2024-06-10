"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

type BookingData = {
  startDate: string | Date;
  endDate: string | Date;
  numNights: number;
  cabinPrice: number;
  cabinId: number;
};

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

  revalidatePath("/account/profile");
}

export async function deleteReservation(bookingId: string) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // checking reservation ownership
  const guestBookings = await getBookings(String(session?.user?.guestId));
  const guestBookingsIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingsIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);
  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateReservation(formData: FormData) {
  const observations = formData.get("observations");
  const numGuests = formData.get("numGuests");
  const bookingId = formData.get("bookingId");

  if (!observations || !numGuests || !bookingId)
    throw new Error("observation and numGuests are required");

  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // checking reservation ownership
  const guestBookings = await getBookings(String(session?.user?.guestId));
  const guestBookingsIds = guestBookings.map((booking) => String(booking.id));

  if (!guestBookingsIds.includes(String(bookingId)))
    throw new Error("Booking could not be updated");

  const { error } = await supabase
    .from("bookings")
    .update({ observations: observations.slice(0, 1000), numGuests })
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be updated");

  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath(`/account/reservations`);
  redirect("/account/reservations");
}

export async function createReservation(
  bookingData: BookingData,
  formData: FormData
) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // for big formData objects
  // Object.entries(formData.entries());

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuest")),
    observations: formData.get("observations")?.slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData?.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };
  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) throw new Error("Booking could not be created");

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}
