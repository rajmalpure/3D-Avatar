import { useEffect, useRef, useState } from 'react'
import { AvatarScene } from './components/AvatarScene'
import { TranscriptPanel } from './components/TranscriptPanel'
import { MicButton } from './components/MicButton'
import { InterviewConfigPanel } from './components/InterviewConfigPanel'
import { InterviewDashboard } from './components/InterviewDashboard'
import { SessionSummary } from './components/SessionSummary'
import { useStore } from './state/useStore'
import type { AvatarExpression } from './state/useStore'
import { createTTSProvider } from './lib/tts/providerAdapter'
import { createLLMProvider } from './lib/llm/providerAdapter'
import type { TTSProvider } from './lib/tts/types'
import type { LLMProvider } from './lib/llm/types'
import {
  buildInterviewerSystemPrompt,
  parseInterviewerResponse,
} from './lib/interview/interviewerLLM'
import { QUESTION_BANK } from './lib/interview/questionBank'

function App() {
  const {
    settings,
    setShowSettings,
    addMessage,
    messages,
    setIsAvatarSpeaking,
    setAvatarExpression,
    isProcessing,
    setIsProcessing,
    sessionActive,
    setSessionActive,
    sessionScore,
    setSessionScore,
    incrementQuestionCount,
    questionCount,
    addFeedback,
    setCurrentQuestion,
    setSessionStartTime,
    showSessionSummary,
    setShowSessionSummary,
  } = useStore()

  const [showSplash, setShowSplash] = useState(true)
  const [splashPhase, setSplashPhase] = useState<'loading' | 'ready'>('loading')
  const [showTranscript, setShowTranscript] = useState(false)

  const ttsProviderRef = useRef<TTSProvider | null>(null)
  const llmProviderRef = useRef<LLMProvider | null>(null)
  const lipSyncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Initialize providers
  useEffect(() => {
    ttsProviderRef.current = createTTSProvider()
    llmProviderRef.current = createLLMProvider(settings.llmProvider)
  }, [settings.llmProvider])

  // Splash Screen
  useEffect(() => {
    const t1 = setTimeout(() => setSplashPhase('ready'), 1800)
    const t2 = setTimeout(() => setShowSplash(false), 3200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // ── Build system prompt from current interview config ──────────────
  const buildSystemPrompt = () => {
    const questionSummary = QUESTION_BANK
      .filter(
        (q) =>
          (settings.interviewMode === 'mixed' || q.category === settings.interviewMode) &&
          q.difficulty === settings.interviewDifficulty
      )
      .map((q) => `[${q.category.toUpperCase()}] ${q.question}`)
      .join('\n')

    return buildInterviewerSystemPrompt(
      {
        mode: settings.interviewMode,
        difficulty: settings.interviewDifficulty,
        targetCompany: settings.targetCompany,
      },
      questionSummary
    )
  }

  // ── Core message handler ────────────────────────────────────────────
  const handleSendMessage = async (userMessage: string) => {
    if (isProcessing) return

    // Detect session control commands
    const lower = userMessage.toLowerCase().trim()
    const startPhrases = ['start interview', 'start', 'begin', "let's begin", "let's start", "i'm ready", 'ready', 'go']
    const endPhrases = ['end interview', 'finish', 'stop interview', "i'm done", 'done', 'end session', 'that\'s all']

    if (!sessionActive && startPhrases.some((p) => lower.includes(p))) {
      startSession(userMessage)
      return
    }

    if (sessionActive && endPhrases.some((p) => lower.includes(p))) {
      endSession(userMessage)
      return
    }

    addMessage({ role: 'user', content: userMessage })

    try {
      setIsProcessing(true)
      setAvatarExpression('thinking')

      const llmProvider = llmProviderRef.current
      if (!llmProvider) throw new Error('LLM provider not initialized')

      const systemPrompt = buildSystemPrompt()
      const history = messages.map((msg) => ({ role: msg.role, content: msg.content }))
      const rawResponse = await llmProvider.chat(userMessage, history, systemPrompt)

      // Parse structured response
      const parsed = parseInterviewerResponse(rawResponse)

      // Update session state
      const expression = parsed.emotion as AvatarExpression
      setAvatarExpression(expression)

      // Running average score
      if (sessionActive && parsed.score > 0) {
        const newTotal = sessionScore * questionCount + parsed.score
        const newCount = questionCount + 1
        setSessionScore(Math.round(newTotal / newCount))
        incrementQuestionCount()

        // Store feedback
        addFeedback({
          questionId: `q-${questionCount}`,
          question: useStore.getState().currentQuestion,
          answer: userMessage,
          score: parsed.score,
          feedback: parsed.feedback,
          strengths: parsed.strengths,
          improvements: parsed.improvements,
        })
      }

      // Update the current question if interviewer gave a new one
      if (parsed.nextQuestion) {
        setCurrentQuestion(parsed.nextQuestion)
      }

      // Add assistant message (feedback text)
      const displayText = parsed.feedback + (parsed.nextQuestion ? `\n\n❓ ${parsed.nextQuestion}` : '')
      addMessage({
        role: 'assistant',
        content: displayText,
        score: parsed.score > 0 ? parsed.score : undefined,
        strengths: parsed.strengths,
        improvements: parsed.improvements,
      })

      setIsProcessing(false)

      // Speak feedback
      await speakResponse(parsed.feedback + (parsed.nextQuestion ? ' ' + parsed.nextQuestion : ''))

      // If nextQuestion is empty, session naturally ended
      if (sessionActive && parsed.nextQuestion === '' && endPhrases.some((p) => lower.includes(p))) {
        setTimeout(() => {
          setSessionActive(false)
          setShowSessionSummary(true)
        }, 1000)
      }
    } catch (error) {
      console.error('Error processing message:', error)
      setIsProcessing(false)
      setAvatarExpression('neutral')
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      addMessage({
        role: 'assistant',
        content: `Sorry, I ran into an issue: ${errorMessage}. Please try again!`,
      })
    }
  }

  const startSession = async (userMessage: string) => {
    setSessionActive(true)
    setSessionStartTime(Date.now())
    setShowTranscript(true)

    addMessage({ role: 'user', content: userMessage })
    setIsProcessing(true)
    setAvatarExpression('happy')

    try {
      const llmProvider = llmProviderRef.current
      if (!llmProvider) throw new Error('LLM provider not initialized')

      const systemPrompt = buildSystemPrompt()
      const rawResponse = await llmProvider.chat(
        'start interview',
        [],
        systemPrompt
      )
      const parsed = parseInterviewerResponse(rawResponse)

      setAvatarExpression((parsed.emotion as AvatarExpression) || 'happy')
      if (parsed.nextQuestion) setCurrentQuestion(parsed.nextQuestion)

      const displayText = parsed.feedback + (parsed.nextQuestion ? `\n\n❓ ${parsed.nextQuestion}` : '')
      addMessage({ role: 'assistant', content: displayText })
      setIsProcessing(false)
      await speakResponse(parsed.feedback + (parsed.nextQuestion ? ' ' + parsed.nextQuestion : ''))
    } catch (err) {
      console.error(err)
      setIsProcessing(false)
    }
  }

  const endSession = async (userMessage: string) => {
    addMessage({ role: 'user', content: userMessage })
    setIsProcessing(true)

    try {
      const llmProvider = llmProviderRef.current
      if (!llmProvider) throw new Error('LLM provider not initialized')

      const systemPrompt = buildSystemPrompt()
      const history = messages.map((m) => ({ role: m.role, content: m.content }))
      const rawResponse = await llmProvider.chat(userMessage, history, systemPrompt)
      const parsed = parseInterviewerResponse(rawResponse)

      setAvatarExpression((parsed.emotion as AvatarExpression) || 'happy')
      addMessage({ role: 'assistant', content: parsed.feedback })
      setIsProcessing(false)
      await speakResponse(parsed.feedback)
    } catch (err) {
      console.error(err)
      setIsProcessing(false)
    }

    setTimeout(() => {
      setSessionActive(false)
      setShowSessionSummary(true)
    }, 2000)
  }

  // ── TTS / lip-sync ─────────────────────────────────────────────────
  const speakResponse = async (text: string) => {
    const ttsProvider = ttsProviderRef.current
    if (!ttsProvider || !ttsProvider.isSupported()) return

    try {
      setIsAvatarSpeaking(true)

      lipSyncIntervalRef.current = setInterval(() => {
        const { setCurrentViseme } = useStore.getState()
        setCurrentViseme(0.3 + Math.random() * 0.7)
      }, 100) as ReturnType<typeof setInterval>

      await ttsProvider.speak(text, {
        voice: settings.ttsVoice,
        rate: settings.ttsSpeed,
        volume: settings.ttsVolume,
        onStart: () => setIsAvatarSpeaking(true),
        onEnd: () => {
          if (lipSyncIntervalRef.current) clearInterval(lipSyncIntervalRef.current)
          useStore.getState().setCurrentViseme(0)
          setIsAvatarSpeaking(false)
          setAvatarExpression('neutral')
        },
      })

      if (lipSyncIntervalRef.current) clearInterval(lipSyncIntervalRef.current)
    } catch (error) {
      console.error('TTS error:', error)
      setIsAvatarSpeaking(false)
      setAvatarExpression('neutral')
      useStore.getState().setCurrentViseme(0)
    }
  }

  const handleTranscript = (transcript: string) => {
    const text = transcript.trim().toLowerCase()
    const stopKeywords = ['stop', 'stop.', 'shh', 'quiet', 'cancel', 'shut up']
    if (stopKeywords.includes(text)) return
    if (transcript.trim()) handleSendMessage(transcript)
  }

  const handleStartInterview = () => {
    if (!sessionActive) {
      handleSendMessage('start interview')
    }
  }

  const handleEndInterview = () => {
    if (sessionActive) {
      handleSendMessage('end interview')
    }
  }

  return (
    <>
      {/* ── Splash Screen ─────────────────────────────────── */}
      <div className={`splash-screen ${!showSplash ? 'fade-out' : ''}`}>
        <div className="splash-brand">
          <div className="splash-logo-icon">🎯</div>
          <h1 className="splash-title">PrepMate 3D</h1>
          <p className="splash-tagline">AI-Powered Interview Coach</p>
        </div>
        <div className={`splash-bottom ${splashPhase === 'ready' ? 'ready' : ''}`}>
          {splashPhase === 'loading' ? (
            <>
              <div className="splash-loader" />
              <p className="splash-loading-text">Initializing your AI coach...</p>
            </>
          ) : (
            <p className="splash-ready-text">✅ Ready to coach you to success!</p>
          )}
        </div>
      </div>

      {/* ── Main App ───────────────────────────────────────── */}
      <div className="app">
        {/* Full-screen 3D avatar */}
        <div className="avatar-container full-screen">
          <AvatarScene />
        </div>

        {/* HUD overlay */}
        <div className="ui-layer">

          {/* Top bar */}
          <div className="hud-top-bar">
            <div className="hud-brand">
              <span className="hud-brand-icon">🎯</span>
              <h1 className="hud-logo">PrepMate 3D</h1>
            </div>

            <div className="hud-top-actions">
              {!sessionActive ? (
                <button
                  id="btn-start-interview"
                  className="btn-start-interview"
                  onClick={handleStartInterview}
                  disabled={isProcessing}
                >
                  🚀 Start Interview
                </button>
              ) : (
                <button
                  id="btn-end-interview"
                  className="btn-end-interview"
                  onClick={handleEndInterview}
                  disabled={isProcessing}
                >
                  🏁 End Session
                </button>
              )}

              <button
                id="btn-toggle-transcript"
                className={`btn-icon-action ${showTranscript ? 'active' : ''}`}
                onClick={() => setShowTranscript(!showTranscript)}
                title="Toggle Transcript"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button
                id="btn-settings"
                className="btn-icon-action"
                onClick={() => setShowSettings(true)}
                title="Interview Settings"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="3" strokeWidth="2" />
                  <path d="M12 1v6m0 6v6M5.6 5.6l4.2 4.2m4.2 4.2l4.2 4.2M1 12h6m6 0h6M5.6 18.4l4.2-4.2m4.2-4.2l4.2-4.2" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>

          {/* Left: Interview Dashboard */}
          <div className="hud-left-panel">
            <InterviewDashboard />
          </div>

          {/* Right: Transcript */}
          {showTranscript && (
            <aside className="chat-container glass-panel">
              <TranscriptPanel onSendMessage={handleSendMessage} />
            </aside>
          )}

          {/* Bottom: Mic */}
          <div className="mic-container floating-mic">
            <MicButton
              onTranscript={handleTranscript}
              onStartListening={() => {
                if (ttsProviderRef.current) ttsProviderRef.current.stop()
                if (lipSyncIntervalRef.current) clearInterval(lipSyncIntervalRef.current)
                setIsAvatarSpeaking(false)
                setAvatarExpression('neutral')
                useStore.getState().setCurrentViseme(0)
              }}
            />
          </div>
        </div>

        {/* Config panel */}
        <InterviewConfigPanel />

        {/* Session summary */}
        {showSessionSummary && <SessionSummary />}
      </div>
    </>
  )
}

export default App
