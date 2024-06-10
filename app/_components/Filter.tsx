"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { FilterSearchParam } from "./CabinList";
import { PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<{
  filter: FilterSearchParam;
  activeFilter: string;
  handleFilter: (filter: FilterSearchParam) => void;
}>;

const filterButtons = [
  { filter: "", text: "All cabins" },
  { filter: "small", text: " 1-3 guests" },
  { filter: "medium", text: " 4-7 guests" },
  { filter: "large", text: " 8-12 guests" },
];

export default function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = searchParams.get("capacity") ?? "";

  function handleFilter(filter: FilterSearchParam) {
    const params = new URLSearchParams(searchParams);
    params.set("capacity", filter);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="border border-primary-800 flex">
      {filterButtons.map(({ filter, text }) => {
        return (
          <Button
            key={filter + text}
            filter={filter}
            handleFilter={handleFilter}
            activeFilter={activeFilter}
          >
            {text}
          </Button>
        );
      })}
    </div>
  );
}

function Button({ filter, handleFilter, activeFilter, children }: ButtonProps) {
  return (
    <button
      className={`px-5 py-2 hover:bg-primary-700 ${
        filter === activeFilter ? "bg-primary-700 text-primary-50" : ""
      }`}
      onClick={() => handleFilter(filter)}
    >
      {children}
    </button>
  );
}
