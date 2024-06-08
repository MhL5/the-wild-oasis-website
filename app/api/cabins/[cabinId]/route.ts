import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";

export async function GET(
  _req: Request,
  { params }: { params: { cabinId?: string } }
) {
  try {
    const { cabinId } = params;
    const [cabin, bookedDates] = await Promise.all([
      getCabin(cabinId ?? ""),
      getBookedDatesByCabinId(cabinId ?? ""),
    ]);

    return Response.json({ cabin, bookedDates });
  } catch (error) {
    return Response.json({ message: "cabin not found" });
  }
}
