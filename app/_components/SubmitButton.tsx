"use client";

import { PropsWithChildren, ReactNode } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = PropsWithChildren<{
  onPendingLabel: ReactNode;
}>;

export default function SubmitButton({
  onPendingLabel,
  children,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300">
      {pending ? onPendingLabel : children}
    </button>
  );
}
