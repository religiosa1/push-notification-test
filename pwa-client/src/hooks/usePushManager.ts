import { getPushManager } from "../utils/getPushManager";

interface UsePushManagerProps {
  registration: ServiceWorkerRegistration;
}

export function usePushManager(props: UsePushManagerProps) {
  const pm = getPushManager(props.registration);
  if (!pm || typeof pm.getSubscription !== "function") {
    return undefined;
  }
  return pm;
}
