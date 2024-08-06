import { useSuspenseQuery } from "@tanstack/react-query";

export function useSwRegistration() {
  const registrationQuery = useSuspenseQuery({
    queryKey: [useSwRegistration.key],
    queryFn: () => navigator.serviceWorker.ready,
  });

  return registrationQuery;
}

useSwRegistration.key = "swRegistration" as const;
