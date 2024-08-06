import { useSuspenseQuery } from "@tanstack/react-query";

interface UsePushManagerProps {
  pushManager: PushManager | undefined;
}

export const PushSubscriptionQueryKey = "push-subscription";
export function usePushSubscription(props: UsePushManagerProps) {
  const registrationQuery = useSuspenseQuery({
    queryKey: [PushSubscriptionQueryKey, props.pushManager],
    queryFn: async () => {
      if (!props.pushManager) {
        return undefined;
      }
      const subscription = await props.pushManager.getSubscription();
      return subscription;
    },
  });

  return registrationQuery;
}
usePushSubscription.key = PushSubscriptionQueryKey;
