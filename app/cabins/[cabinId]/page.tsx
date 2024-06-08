import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { Suspense } from "react";

type Params = { cabinId?: string };
type GenerateMetadataParams = { params: Params };
type PageProps = {
  params: Params;
};

export async function generateMetadata({ params }: GenerateMetadataParams) {
  const cabin = await getCabin(params?.cabinId || "");

  return { title: `Cabin ${cabin.name}` };
}

export async function generateStaticParams() {
  const cabins = await getCabins();

  return cabins.map((cabin) => ({ cabinId: String(cabin.id) }));
}

export default async function Page({ params }: PageProps) {
  const cabin = await getCabin(params?.cabinId || "");

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />

      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>
        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
