import { useNotificationPermissions } from "../hooks/useNotificationsPermissions";

interface PermissionStatusDisplayProps {
  subscription: PushSubscription | null | undefined;
}
export function PermissionStatusDisplay(props: PermissionStatusDisplayProps) {
  const hasNotificationPermission = useNotificationPermissions();

  if (hasNotificationPermission) {
    return <p>You gave this app permissions for notifications</p>;
  }

  if (hasNotificationPermission === undefined) {
    return <p>Can't reliably determine permission status in your browser.</p>;
  }

  return (
    <>
      <p>This app doesn't have your permission for notification.</p>
      {props.subscription && (
        <>
          <p>
            Though you have an active notification subscription, you don't have
            (most likely you revoked) the notification permissions, so you won'
            recieve anything.
          </p>
          <button
            onClick={() => window.Notification?.requestPermission?.()}
            type="button"
          >
            Click here to provide the permissions
          </button>
        </>
      )}
    </>
  );
}
