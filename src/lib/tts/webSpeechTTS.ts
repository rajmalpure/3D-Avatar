import type { TTSProvider, TTSOptions } from './types'

export class WebSpeechTTS implements TTSProvider {
  private synthesis: SpeechSynthesis

  constructor() {
    this.synthesis = window.speechSynthesis
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices()
  }

  async speak(text: string, options: TTSOptions = {}): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Speech synthesis is not supported in this browser')
    }

    // Cancel any ongoing speech
    this.stop()

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text)

      // Set voice
      if (options.voice) {
        const voices = this.getVoices()
        const selectedVoice = voices.find(v => v.name === options.voice)
        if (selectedVoice) {
          utterance.voice = selectedVoice
        }
      }

      // Set parameters
      utterance.rate = options.rate ?? 1.0
      utterance.pitch = options.pitch ?? 1.0
      utterance.volume = options.volume ?? 1.0

      // Event handlers
      utterance.onstart = () => {
        options.onStart?.()
      }

      utterance.onend = () => {
        options.onEnd?.()
        resolve()
      }

      utterance.onerror = (event) => {
        reject(new Error(`Speech synthesis error: ${event.error}`))
      }

      utterance.onboundary = (event) => {
        options.onBoundary?.({
          charIndex: event.charIndex,
          name: event.name
        })
      }

      this.synthesis.speak(utterance)
    })
  }

  stop(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel()
    }
  }
}
