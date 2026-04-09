import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export type AvatarExpression = 'neutral' | 'happy' | 'thinking' | 'speaking' | 'sad' | 'angry' | 'surprised'

export type TTSProvider = 'webspeech'
export type LLMProvider = 'local' | 'gemini'

type Settings = {
  ttsProvider: TTSProvider
  llmProvider: LLMProvider
  ttsVolume: number
  ttsSpeed: number
  ttsVoice: string
  avatarModel: string
  persona: string
}

type AppState = {
  // Chat
  messages: Message[]
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  clearMessages: () => void
  
  // Avatar state
  isAvatarSpeaking: boolean
  setIsAvatarSpeaking: (speaking: boolean) => void
  avatarExpression: AvatarExpression
  setAvatarExpression: (expression: AvatarExpression) => void
  currentViseme: number
  setCurrentViseme: (viseme: number) => void
  
  // Voice interaction
  isListening: boolean
  setIsListening: (listening: boolean) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
  
  // Settings
  settings: Settings
  updateSettings: (settings: Partial<Settings>) => void
  
  // UI
  showSettings: boolean
  setShowSettings: (show: boolean) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Chat
      messages: [],
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, {
          ...message,
          id: `${Date.now()}-${Math.random()}`,
          timestamp: Date.now()
        }]
      })),
      clearMessages: () => set({ messages: [] }),
      
      // Avatar state
      isAvatarSpeaking: false,
      setIsAvatarSpeaking: (speaking) => set({ isAvatarSpeaking: speaking }),
      avatarExpression: 'neutral',
      setAvatarExpression: (expression) => set({ avatarExpression: expression }),
      currentViseme: 0,
      setCurrentViseme: (viseme) => set({ currentViseme: viseme }),
      
      // Voice interaction
      isListening: false,
      setIsListening: (listening) => set({ isListening: listening }),
      isProcessing: false,
      setIsProcessing: (processing) => set({ isProcessing: processing }),
      
      // Settings
      settings: {
        ttsProvider: (import.meta.env.VITE_TTS_PROVIDER || 'webspeech') as TTSProvider,
        llmProvider: (import.meta.env.VITE_LLM_PROVIDER || 'local') as LLMProvider,
        ttsVolume: 1.0,
        ttsSpeed: 1.0,
        ttsVoice: '',
        avatarModel: 'default',
        persona: 'helpful'
      },
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      
      // UI
      showSettings: false,
      setShowSettings: (show) => set({ showSettings: show })
    }),
    {
      name: 'avatar-storage', // unique name for localStorage access
      partialize: (state) => ({
        messages: state.messages,
        settings: state.settings
      } as unknown as AppState) // only store these specific nodes
    }
  )
)
