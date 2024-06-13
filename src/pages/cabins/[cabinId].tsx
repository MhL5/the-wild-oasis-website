import CabinView from "@/components/CabinView";
import { getCabin } from "@/lib/data-service";
import Head from "next/head";

export async function getServerSideProps({ params }) {
  const cabin = await getCabin(params.cabinId);
  return { props: { cabin }, revalidate: 3600 };
}

// this is how we do SSG:
// getStaticPaths + getStaticProps

export default function Cabin({ cabin }) {
  return (
    <>
      <Head>
        <title>cabin {cabin.name} | the wild oasis </title>
      </Head>
      <div className="max-w-6xl mx-auto mt-8">
        <CabinView cabin={cabin} />
      </div>
    </>
  );
}
