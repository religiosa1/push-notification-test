import { useEffect, useState } from "react";

/** Semi-effective way to check for the notification permissions. */
export function useNotificationPermissions(): boolean | undefined {
  const [hasPermission, setHasPermission] = useState<boolean | undefined>(
    // window.Notifiaction will be undefined in older browsers, specifically Safari
    () => window.Notification?.permission === "granted"
  );

  useEffect(() => {
    const controller = new window.AbortController();
    // On older browsers permissions won't be reactive and will require a full page reload.
    navigator.permissions?.query?.({ name: "notifications" }).then((perm) => {
      perm.addEventListener(
        "change",
        () => setHasPermission(perm.state === "granted"),
        { signal: controller.signal }
      );
    });
    return () => controller.abort();
  }, []);

  return hasPermission;
}
