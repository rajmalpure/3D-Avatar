import type { LLMProvider } from './types'
import { LocalLLM } from './localLLM'
import { GeminiLLM } from './geminiLLM'

export function createLLMProvider(provider: 'local' | 'gemini' = 'local'): LLMProvider {
  switch (provider) {
    case 'gemini':
      return new GeminiLLM()
    case 'local':
    default:
      return new LocalLLM()
  }
}
