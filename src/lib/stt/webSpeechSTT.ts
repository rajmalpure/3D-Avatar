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

    this.recognition.onstart = () => {
      console.log('Speech recognition started')
      this.isRecognizing = true
      options.onStart?.()
    }

    this.recognition.onresult = (event: any) => {
      console.log('Speech recognition result:', event)
      const results = event.results
      const lastResult = results[results.length - 1]
      const transcript = lastResult[0].transcript
      const isFinal = lastResult.isFinal

      console.log('Transcript:', transcript, 'Final:', isFinal)
      options.onResult?.(transcript, isFinal)
    }

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      options.onError?.(event.error)
      this.isRecognizing = false
    }

    this.recognition.onend = () => {
      console.log('Speech recognition ended')
      this.isRecognizing = false
      options.onEnd?.()
    }

    try {
      this.recognition.start()
      console.log('Starting speech recognition...')
    } catch (error) {
      console.error('Failed to start recognition:', error)
      this.isRecognizing = false
      throw error
    }
  }

  stopListening(): void {
    if (this.recognition && this.isRecognizing) {
      this.recognition.stop()
      this.isRecognizing = false
    }
  }
}
