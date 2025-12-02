export interface TTSProvider {
  speak(text: string, options?: TTSOptions): Promise<void>
  stop(): void
  getVoices(): SpeechSynthesisVoice[]
  isSupported(): boolean
}

export interface TTSOptions {
  voice?: string
  rate?: number
  pitch?: number
  volume?: number
  onStart?: () => void
  onEnd?: () => void
  onBoundary?: (event: { charIndex: number; name?: string }) => void
}
