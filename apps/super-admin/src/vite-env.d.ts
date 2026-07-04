/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NETWORK_ADMIN_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
