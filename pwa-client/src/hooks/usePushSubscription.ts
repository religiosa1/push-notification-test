import { useSuspenseQuery } from "@tanstack/react-query";
import { getPushManager } from "../utils/getPushManager";

interface UsePushManagerProps {
  registration: ServiceWorkerRegistration | undefined;
}
export function usePushSubscription(props: UsePushManagerProps) {
  const registrationQuery = useSuspenseQuery({
    queryKey: [usePushSubscription.key, props.registration],
    queryFn: async () => {
      if (!props.registration) {
        return undefined;
      }
      const pushManager = getPushManager(props.registration);
      if (!pushManager) {
        throw new Error(
          "Unexpected empty push manager in the initial resource query."
        );
      }
      if (typeof pushManager.getSubscription !== "function") {
        throw new Error(
          "No getSubscription function on the pushmanager instance. "
        );
      }
      const subscription = await pushManager.getSubscription();
      return subscription;
    },
  });

  return registrationQuery;
}
usePushSubscription.key = "pushSubscription" as const;
