import SubmitButton from "@/app/_components/SubmitButton";
import { updateReservation } from "@/app/_lib/actions";
import { getBooking, getCabin } from "@/app/_lib/data-service";

type PageProps = { params: { bookingId?: string } };

export default async function Page({ params }: PageProps) {
  const bookingId = params?.bookingId;

  if (!bookingId) return <div>not found</div>;

  const { cabinId, numGuests, observations } = await getBooking(bookingId);
  const { maxCapacity } = await getCabin(String(cabinId));

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{bookingId}
      </h2>

      <form
        className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
        action={updateReservation}
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests? {numGuests}</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
            defaultValue={numGuests}
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            defaultValue={observations}
            name="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          />
        </div>

        <input type="hidden" name="bookingId" value={bookingId} />

        <div className="flex justify-end items-center gap-6">
          <SubmitButton onPendingLabel="Updating....">
            update Reservation
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
