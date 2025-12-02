import type { TTSProvider } from './types'
import { WebSpeechTTS } from './webSpeechTTS'

export function createTTSProvider(): TTSProvider {
  return new WebSpeechTTS()
}
