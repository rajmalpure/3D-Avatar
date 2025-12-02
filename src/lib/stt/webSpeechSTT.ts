import type { STTProvider, STTOptions } from './types'

export class WebSpeechSTT implements STTProvider {
  private recognition: any = null
  private isRecognizing = false

  constructor() {
    if (this.isSupported()) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      this.recognition = new SpeechRecognition()
    }
  }

  isSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  }

  async startListening(options: STTOptions = {}): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Speech recognition is not supported in this browser')
    }

    if (this.isRecognizing) {
      this.stopListening()
    }

    this.recognition.lang = options.language || 'en-US'
    this.recognition.continuous = options.continuous ?? false
    this.recognition.interimResults = options.interimResults ?? true

    this.recognition.onresult = (event: any) => {
      const results = event.results
      const lastResult = results[results.length - 1]
      const transcript = lastResult[0].transcript
      const isFinal = lastResult.isFinal

      options.onResult?.(transcript, isFinal)
    }

    this.recognition.onerror = (event: any) => {
      options.onError?.(event.error)
      this.isRecognizing = false
    }

    this.recognition.onend = () => {
      this.isRecognizing = false
      options.onEnd?.()
    }

    this.recognition.start()
    this.isRecognizing = true
  }

  stopListening(): void {
    if (this.recognition && this.isRecognizing) {
      this.recognition.stop()
      this.isRecognizing = false
    }
  }
}
