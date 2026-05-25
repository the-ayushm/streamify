/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_SERVER_URL?: string
  readonly VITE_TURN_URL?: string
  readonly VITE_TURN_USERNAME?: string
  readonly VITE_TURN_CREDENTIAL?: string
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv
}
