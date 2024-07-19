/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/solid" />

// Older safari-specific interfaces
interface Window {
  safari?: {
    pushNotification?: PushManager;
  };
}
