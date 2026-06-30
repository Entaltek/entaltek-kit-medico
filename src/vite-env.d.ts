/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base del backend. Valor PUBLICO: nunca poner secretos en variables VITE_*. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
