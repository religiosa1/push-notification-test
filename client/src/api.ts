import { urlBase64ToUint8Array } from "./utils/urlBase64ToUint8Array";

const baseUrl = import.meta.env.VITE_SERVER_URL;

export async function getVapidPublicKey(): Promise<Uint8Array> {
	const vapidPublicKey = await fetch(new URL("/vapidPublicKey", baseUrl))
		.then(checkResponseStatus)
		.then((r) => r.text());

	const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
	return convertedVapidKey;
}

export async function sendSubscriptionToServer(
	subscription: PushSubscription,
): Promise<void> {
	fetch(new URL("/register", baseUrl), {
		method: "post",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify({ subscription }),
	});
}

export async function sendUnsubRequestToServer(
	subscription: PushSubscription,
): Promise<void> {
	fetch(new URL("/unregister", baseUrl), {
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
