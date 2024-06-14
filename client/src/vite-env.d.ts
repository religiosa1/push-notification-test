/// <reference types="vite/client" />
interface ImportMetaEnv {
  /** URL for the backend, which is prepended to all of the backend fetches */
  readonly VITE_SERVER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
