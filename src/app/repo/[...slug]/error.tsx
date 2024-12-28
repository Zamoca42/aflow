"use client";

import { ErrorMessageProps } from "@/type";
import { useEffect } from "react";

export const ErrorMessage = ({ title, message, action }: ErrorMessageProps) => (
  <div className="main-container">
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="message-title">{title}</h2>
      <p className="mb-4">{message}</p>
      {action}
    </div>
  </div>
);

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const errorProps: ErrorMessageProps = {
    title: "Something went wrong!",
    message: error.message || "An unexpected error occurred.",
    action: <button onClick={reset}>Try again</button>,
  };

  return <ErrorMessage {...errorProps} />;
}
