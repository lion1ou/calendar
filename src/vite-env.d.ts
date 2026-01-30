/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STORAGE_KEY?: string;
  readonly VITE_GD_WEATHER_KEY?: string;
  readonly VITE_HF_WEATHER_KEY?: string;
  readonly VITE_XZ_WEATHER_KEY?: string;
  readonly VITE_XZ_WEATHER_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
