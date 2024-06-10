"use client";

import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { DateRange } from "react-day-picker";

type ReservationContextProviderProps = PropsWithChildren;
export type RangeState = DateRange | undefined;
type ReservationContextValues = {
  range: RangeState;
  setRange: Dispatch<SetStateAction<RangeState>>;
  resetRange: () => void;
} | null;

const ReservationContext = createContext<ReservationContextValues>(null);

const rangeStateInitialValue = {
  from: undefined,
  to: undefined,
};

function ReservationContextProvider({
  children,
}: ReservationContextProviderProps) {
  const [range, setRange] = useState<RangeState>(rangeStateInitialValue);

  const resetRange = () => setRange(rangeStateInitialValue);

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservationContext() {
  const context = useContext(ReservationContext);
  if (!context)
    throw new Error("Reservation Context was called outside of its provider");
  return context;
}

export { useReservationContext };
export default ReservationContextProvider;
