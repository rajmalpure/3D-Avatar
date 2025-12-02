export interface STTProvider {
  startListening(options?: STTOptions): Promise<void>
  stopListening(): void
  isSupported(): boolean
}

export interface STTOptions {
  language?: string
  continuous?: boolean
  interimResults?: boolean
  onResult?: (transcript: string, isFinal: boolean) => void
  onError?: (error: string) => void
  onEnd?: () => void
}
