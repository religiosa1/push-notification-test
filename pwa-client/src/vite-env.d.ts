/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

// Older safari-specific interfaces
interface Window {
  safari?: {
    pushNotification?: PushManager;
  };
}
