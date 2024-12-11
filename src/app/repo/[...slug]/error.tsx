"use client";

import { ErrorMessage } from "@/component/message";
import { ErrorMessageProps } from "@/type";
import { useEffect } from "react";
import { RepoError } from "@/lib/error";

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
    title: error instanceof RepoError ? error.title : "Something went wrong!",
    message: error.message || "An unexpected error occurred.",
    action:
      error instanceof RepoError && error.action ? (
        error.action
      ) : (
        <button onClick={reset}>Try again</button>
      ),
  };

  return <ErrorMessage {...errorProps} />;
}
