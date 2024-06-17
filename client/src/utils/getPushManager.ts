/** Get push notification with a fallback for mobile safari < 16.4
 *
 * @see https://whatwebcando.today/push-notifications.html
 */
export function getPushManager(
	registration: ServiceWorkerRegistration
): PushManager {
	return window.safari?.pushNotification ?? registration.pushManager;
}
