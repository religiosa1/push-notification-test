import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscribe, unsubscribe } from "../services/notifications";
import { PermissionStatusDisplay } from "./PermissionsStatusDisplay";
import { useSwRegistration } from "../hooks/useSwRegistration";
import { usePushSubscription } from "../hooks/usePushSubscription";

export function SubUnsub() {
  const queryClient = useQueryClient();
  const registration = useSwRegistration();
  const subscription = usePushSubscription({ registration: registration.data });

  const unsubscribeMutation = useMutation({
    mutationFn: unsubscribe,
    onSuccess: () => {},
  });

  const subscribeMutation = useMutation({
    mutationFn: subscribe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [usePushSubscription.key] });
    },
  });

  const pending = unsubscribeMutation.isPending || subscribeMutation.isPending;
  const error = unsubscribeMutation.error || subscribeMutation.error;

  return (
    <>
      <div className="loader">
        <PermissionStatusDisplay subscription={subscription.data} />
      </div>
      <div className="loader">
        {pending ? (
          <span>Processing...</span>
        ) : error != null ? (
          <span>
            Error while handling the operation:
            <code>
              <pre>{String(error)}</pre>
            </code>
          </span>
        ) : null}
      </div>
      {subscription.data != null ? (
        <>
          <p>You're subscribed to the notifications.</p>
          <button
            disabled={pending}
            type="button"
            onClick={() => unsubscribeMutation.mutate(subscription.data)}
          >
            Click here to unsubscribe
          </button>
        </>
      ) : (
        <button
          disabled={pending}
          type="button"
          onClick={() => subscribeMutation.mutate(registration.data)}
        >
          Click here to subscribe to notifications
        </button>
      )}
    </>
  );
}
