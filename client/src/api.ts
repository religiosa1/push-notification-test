import { urlBase64ToUint8Array } from "./utils/urlBase64ToUint8Array";

export async function getVapidPublicKey(): Promise<Uint8Array> {
  const vapidPublicKey = await fetch("./vapidPublicKey")
    .then(checkResponseStatus)
    .then((r) => r.text());

  const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
  return convertedVapidKey;
}

export async function sendSubscriptionToServer(
  subscription: PushSubscription
): Promise<void> {
  fetch("./register", {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ subscription }),
  });
}

export class HttpError extends Error {
  override name = "HttpError";

  constructor(public status: number, message: string) {
    super(message);
  }
}

function checkResponseStatus(r: Response): Response {
  if (!r.ok) {
    throw new HttpError(r.status, r.statusText);
  }
  return r;
}
