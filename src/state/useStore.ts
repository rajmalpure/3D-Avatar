import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { QuestionCategory, Difficulty } from '../lib/interview/questionBank'

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  score?: number          // per-answer score (0-100)
  strengths?: string[]
  improvements?: string[]
}

export type AvatarExpression = 'neutral' | 'happy' | 'thinking' | 'speaking' | 'sad' | 'angry' | 'surprised'

export type TTSProvider = 'webspeech'
export type LLMProvider = 'local' | 'gemini'

export type InterviewMode = QuestionCategory | 'mixed'
export type InterviewDifficulty = Difficulty
export type TargetCompany = 'general' | 'google' | 'amazon' | 'meta' | 'microsoft' | 'apple' | 'startup'

type Settings = {
  ttsProvider: TTSProvider
  llmProvider: LLMProvider
  ttsVolume: number
  ttsSpeed: number
  ttsVoice: string
  avatarModel: string
  // Interview-specific settings
  interviewMode: InterviewMode
  interviewDifficulty: InterviewDifficulty
  targetCompany: TargetCompany
  resumeText: string | null
}

export type FeedbackEntry = {
  questionId: string
  question: string
  answer: string
  score: number
  feedback: string
  strengths: string[]
  improvements: string[]
}

type AppState = {
  // Chat
  messages: Message[]
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  updateLastAssistantMessage: (updates: Partial<Message>) => void
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

  // Interview Session
  sessionActive: boolean
  setSessionActive: (active: boolean) => void
  sessionScore: number
  setSessionScore: (score: number) => void
  questionCount: number
  incrementQuestionCount: () => void
  feedbackHistory: FeedbackEntry[]
  addFeedback: (entry: FeedbackEntry) => void
  currentQuestion: string
  setCurrentQuestion: (q: string) => void
  sessionStartTime: number | null
  setSessionStartTime: (t: number | null) => void
  showSessionSummary: boolean
  setShowSessionSummary: (show: boolean) => void
  answeredQuestionIds: string[]
  addAnsweredQuestionId: (id: string) => void

  // Reset full session
  resetSession: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Chat
      messages: [],
      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: `${Date.now()}-${Math.random()}`,
              timestamp: Date.now(),
            },
          ],
        })),
      updateLastAssistantMessage: (updates) =>
        set((state) => {
          const msgs = [...state.messages]
          for (let i = msgs.length - 1; i >= 0; i--) {
            if (msgs[i].role === 'assistant') {
              msgs[i] = { ...msgs[i], ...updates }
              break
            }
          }
          return { messages: msgs }
        }),
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
        interviewMode: 'mixed',
        interviewDifficulty: 'mid',
        targetCompany: 'general',
        resumeText: null,
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // UI
      showSettings: false,
      setShowSettings: (show) => set({ showSettings: show }),

      // Interview Session
      sessionActive: false,
      setSessionActive: (active) => set({ sessionActive: active }),
      sessionScore: 0,
      setSessionScore: (score) => set({ sessionScore: score }),
      questionCount: 0,
      incrementQuestionCount: () =>
        set((state) => ({ questionCount: state.questionCount + 1 })),
      feedbackHistory: [],
      addFeedback: (entry) =>
        set((state) => ({ feedbackHistory: [...state.feedbackHistory, entry] })),
      currentQuestion: '',
      setCurrentQuestion: (q) => set({ currentQuestion: q }),
      sessionStartTime: null,
      setSessionStartTime: (t) => set({ sessionStartTime: t }),
      showSessionSummary: false,
      setShowSessionSummary: (show) => set({ showSessionSummary: show }),
      answeredQuestionIds: [],
      addAnsweredQuestionId: (id) =>
        set((state) => ({ answeredQuestionIds: [...state.answeredQuestionIds, id] })),

      resetSession: () =>
        set({
          sessionActive: false,
          sessionScore: 0,
          questionCount: 0,
          feedbackHistory: [],
          currentQuestion: '',
          sessionStartTime: null,
          showSessionSummary: false,
          answeredQuestionIds: [],
          messages: [],
        }),
    }),
    {
      name: 'prepmate-storage',
      partialize: (state) =>
        ({
          settings: state.settings,
        } as unknown as AppState),
    }
  )
)
