/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TTS_PROVIDER?: string
  readonly VITE_LLM_PROVIDER?: string
  readonly VITE_OPENAI_API_KEY?: string
  readonly VITE_OPENAI_TTS_MODEL?: string
  readonly VITE_OPENAI_TTS_VOICE?: string
  readonly VITE_OPENAI_LLM_MODEL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
