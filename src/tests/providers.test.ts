import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock Web Speech API
const mockSpeechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  getVoices: vi.fn(() => [] as SpeechSynthesisVoice[]),
  speaking: false,
  paused: false,
  pending: false,
  pause: vi.fn(),
  resume: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
  onvoiceschanged: null,
}

// @ts-ignore
global.window = {
  speechSynthesis: mockSpeechSynthesis
}

describe('TTS Provider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('WebSpeechTTS', () => {
    it('should detect if speech synthesis is supported', async () => {
      const { WebSpeechTTS } = await import('../lib/tts/webSpeechTTS')
      const tts = new WebSpeechTTS()
      expect(tts.isSupported()).toBe(true)
    })

    it('should return available voices', async () => {
      const mockVoices = [
        { name: 'Voice 1', lang: 'en-US', default: false, localService: true, voiceURI: 'Voice 1' },
        { name: 'Voice 2', lang: 'en-GB', default: false, localService: true, voiceURI: 'Voice 2' }
      ] as SpeechSynthesisVoice[]
      mockSpeechSynthesis.getVoices.mockReturnValue(mockVoices)
      
      const { WebSpeechTTS } = await import('../lib/tts/webSpeechTTS')
      const tts = new WebSpeechTTS()
      const voices = tts.getVoices()
      
      expect(voices.length).toBe(2)
      expect(voices[0].name).toBe('Voice 1')
    })

    it('should call speak with correct parameters', async () => {
      const { WebSpeechTTS } = await import('../lib/tts/webSpeechTTS')
      const tts = new WebSpeechTTS()
      
      // Mock the speak method to resolve immediately
      mockSpeechSynthesis.speak.mockImplementation((utterance) => {
        // Simulate immediate completion
        setTimeout(() => {
          if (utterance.onend) utterance.onend()
        }, 0)
      })
      
      const speakPromise = tts.speak('Hello world', {
        rate: 1.5,
        volume: 0.8
      })
      
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled()
      await speakPromise
    })

    it('should cancel ongoing speech when stop is called', async () => {
      const { WebSpeechTTS } = await import('../lib/tts/webSpeechTTS')
      const tts = new WebSpeechTTS()
      
      mockSpeechSynthesis.speaking = true
      tts.stop()
      
      expect(mockSpeechSynthesis.cancel).toHaveBeenCalled()
    })
  })

  describe('TTS Provider Adapter', () => {
    it('should create WebSpeechTTS by default', async () => {
      const { createTTSProvider } = await import('../lib/tts/providerAdapter')
      const provider = createTTSProvider()
      expect(provider.isSupported()).toBe(true)
    })

    it('should create WebSpeechTTS when specified', async () => {
      const { createTTSProvider } = await import('../lib/tts/providerAdapter')
      const provider = createTTSProvider()
      expect(provider.isSupported()).toBe(true)
    })
  })
})

describe('LLM Provider', () => {
  describe('LocalLLM', () => {
    it('should always be supported', async () => {
      const { LocalLLM } = await import('../lib/llm/localLLM')
      const llm = new LocalLLM()
      expect(llm.isSupported()).toBe(true)
    })

    it('should respond to greetings', async () => {
      const { LocalLLM } = await import('../lib/llm/localLLM')
      const llm = new LocalLLM()
      const response = await llm.chat('Hello')
      expect(response).toContain('Hello')
    })

    it('should respond to thanks', async () => {
      const { LocalLLM } = await import('../lib/llm/localLLM')
      const llm = new LocalLLM()
      const response = await llm.chat('Thank you')
      expect(response.toLowerCase()).toContain('welcome')
    })

    it('should provide time when asked', async () => {
      const { LocalLLM } = await import('../lib/llm/localLLM')
      const llm = new LocalLLM()
      const response = await llm.chat('What time is it?')
      expect(response.toLowerCase()).toContain('time')
    })

    it('should provide date when asked', async () => {
      const { LocalLLM } = await import('../lib/llm/localLLM')
      const llm = new LocalLLM()
      const response = await llm.chat('What is the date?')
      expect(response.toLowerCase()).toMatch(/today|date/)
    })
  })

  describe('LLM Provider Adapter', () => {
    it('should create LocalLLM by default', async () => {
      const { createLLMProvider } = await import('../lib/llm/providerAdapter')
      const provider = createLLMProvider()
      expect(provider.isSupported()).toBe(true)
    })

    it('should create LocalLLM when specified', async () => {
      const { createLLMProvider } = await import('../lib/llm/providerAdapter')
      const provider = createLLMProvider('local')
      expect(provider.isSupported()).toBe(true)
    })
  })
})
