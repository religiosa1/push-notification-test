import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscribe, unsubscribe } from "../services/notifications";
import { PermissionStatusDisplay } from "./PermissionsStatusDisplay";
import { useSwRegistration } from "../hooks/useSwRegistration";
import { usePushSubscription } from "../hooks/usePushSubscription";
import { usePushManager } from "../hooks/usePushManager";
import { isSafari } from "../utils/isSafari";

export function SubUnsub() {
  const queryClient = useQueryClient();
  const registration = useSwRegistration();
  const pushManager = usePushManager({ registration: registration.data });
  const subscription = usePushSubscription({ pushManager });

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

  if (registration.isFetched && !pushManager) {
    return (
      <>
        <p>
          Unable to obtain PushManager. Seems like your device doesn't support
          push notifications.
        </p>
        {isSafari() && (
          <>
            <p>
              On Apple devices, you need to install the application on your
              desktop, to recieve push notifiactions. Here's how you can do it:
            </p>
            <ul>
              <li>Tap the 'Share' button.</li>
              <li>Select 'Add to Home Screen' from the popup.</li>
              <li>Tap 'Add' in the top right corner.</li>
            </ul>
          </>
        )}
      </>
    );
  }

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
