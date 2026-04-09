import { useEffect, useRef, useState } from 'react'
import { AvatarScene } from './components/AvatarScene'
import { ChatPanel } from './components/ChatPanel'
import { MicButton } from './components/MicButton'
import { SettingsPanel } from './components/SettingsPanel'
import { useStore } from './state/useStore'
import type { AvatarExpression } from './state/useStore'
import { createTTSProvider } from './lib/tts/providerAdapter'
import { createLLMProvider } from './lib/llm/providerAdapter'
import type { TTSProvider } from './lib/tts/types'
import type { LLMProvider } from './lib/llm/types'

function App() {
  const { 
    settings,
    setShowSettings, 
    addMessage, 
    messages,
    setIsAvatarSpeaking,
    setAvatarExpression,
    isProcessing,
    setIsProcessing
  } = useStore()
  
  const [showSplash, setShowSplash] = useState(true)
  const [showChat, setShowChat] = useState(false)
  
  const ttsProviderRef = useRef<TTSProvider | null>(null)
  const llmProviderRef = useRef<LLMProvider | null>(null)
  const lipSyncIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize providers
  useEffect(() => {
    ttsProviderRef.current = createTTSProvider()
    llmProviderRef.current = createLLMProvider(settings.llmProvider)
  }, [settings.llmProvider])

  // Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  const handleSendMessage = async (userMessage: string) => {
    if (isProcessing) return
    
    // Add user message
    addMessage({
      role: 'user',
      content: userMessage
    })

    try {
      setIsProcessing(true)
      setAvatarExpression('thinking')

      // Get LLM response
      const llmProvider = llmProviderRef.current
      if (!llmProvider) {
        throw new Error('LLM provider not initialized')
      }

      const systemPrompt = `You are a 3D Avatar Assistant. Your persona is: ${settings.persona}. You MUST start EVERY response with EXACTLY ONE of these emotion tags representing your feeling: [NEUTRAL], [HAPPY], [THINKING], [SAD], [ANGRY], or [SURPRISED]. Example: [HAPPY] It is so nice to meet you!`


      // Convert messages to conversation history
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await llmProvider.chat(userMessage, history, systemPrompt)

      // Parse emotion
      let expression: AvatarExpression = 'neutral'
      let cleanResponse = response
      const emotionMatch = response.match(/^\[(NEUTRAL|HAPPY|THINKING|SAD|ANGRY|SURPRISED)\]\s*/i)
      if (emotionMatch) {
        expression = emotionMatch[1].toLowerCase() as AvatarExpression
        cleanResponse = response.substring(emotionMatch[0].length).trim()
      }

      setAvatarExpression(expression)

      // Add assistant message
      addMessage({
        role: 'assistant',
        content: cleanResponse
      })

      setIsProcessing(false)
      
      // Speak the response
      await speakResponse(cleanResponse)

    } catch (error) {
      console.error('Error processing message:', error)
      setIsProcessing(false)
      setAvatarExpression('neutral')
      
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      addMessage({
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}`
      })
    }
  }

  const speakResponse = async (text: string) => {
    const ttsProvider = ttsProviderRef.current
    if (!ttsProvider || !ttsProvider.isSupported()) {
      console.warn('TTS not available')
      return
    }

    try {
      setIsAvatarSpeaking(true)

      // Simulate lip sync with random viseme values during speech
      lipSyncIntervalRef.current = setInterval(() => {
        const { setCurrentViseme } = useStore.getState()
        // Random mouth movement to simulate speech
        const visemeValue = 0.3 + Math.random() * 0.7
        setCurrentViseme(visemeValue)
      }, 100) as unknown as NodeJS.Timeout

      await ttsProvider.speak(text, {
        voice: settings.ttsVoice,
        rate: settings.ttsSpeed,
        volume: settings.ttsVolume,
        onStart: () => {
          setIsAvatarSpeaking(true)
        },
        onEnd: () => {
          if (lipSyncIntervalRef.current) clearInterval(lipSyncIntervalRef.current)
          const { setCurrentViseme } = useStore.getState()
          setCurrentViseme(0)
          setIsAvatarSpeaking(false)
          setAvatarExpression('neutral')
        }
      })

      if (lipSyncIntervalRef.current) clearInterval(lipSyncIntervalRef.current)
    } catch (error) {
      console.error('TTS error:', error)
      setIsAvatarSpeaking(false)
      setAvatarExpression('neutral')
      const { setCurrentViseme } = useStore.getState()
      setCurrentViseme(0)
    }
  }

  const handleTranscript = (transcript: string) => {
    const text = transcript.trim().toLowerCase()
    const stopKeywords = ['stop', 'stop.', 'shh', 'quiet', 'cancel', 'shut up']
    if (stopKeywords.includes(text)) {
      return // TTS was already halted by onStartListening, just skip generating a response.
    }

    if (transcript.trim()) {
      handleSendMessage(transcript)
    }
  }

  return (
    <>
      <div className={`splash-screen ${!showSplash ? 'fade-out' : ''}`}>
        <h1 className="splash-title">3D Avatar Assistant</h1>
        <div className="splash-loader"></div>
      </div>

      <div className="app">
        {/* Background Full Screen Avatar */}
        <div className="avatar-container full-screen">
          <AvatarScene />
        </div>

        {/* Floating HUD Layer */}
        <div className="ui-layer">
          {/* Logo and Settings - Absolute Positioned to avoid blocking Avatar head */}
          <div className="hud-top-left">
            <h1 className="hud-logo">3D AI Avatar</h1>
          </div>
          
          <div className="hud-top-right">
            <button 
              className="btn-settings glass-btn"
              onClick={() => setShowSettings(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="3" strokeWidth="2" />
                <path d="M12 1v6m0 6v6M5.6 5.6l4.2 4.2m4.2 4.2l4.2 4.2M1 12h6m6 0h6M5.6 18.4l4.2-4.2m4.2-4.2l4.2-4.2" strokeWidth="2" />
              </svg>
            </button>
          </div>

          <div className="hud-mid-right">
            <button 
              className={`btn-chat-toggle ${showChat ? 'active' : ''}`}
              onClick={() => setShowChat(!showChat)}
              title="Toggle Chat"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Chat Interface */}
          {showChat && (
            <aside className="chat-container glass-panel">
              <ChatPanel onSendMessage={handleSendMessage} />
            </aside>
          )}

        {/* Mic Button */}
        <div className="mic-container floating-mic">
          <MicButton 
            onTranscript={handleTranscript} 
            onStartListening={() => {
              if (ttsProviderRef.current) {
                ttsProviderRef.current.stop()
              }
              if (lipSyncIntervalRef.current) clearInterval(lipSyncIntervalRef.current)
              setIsAvatarSpeaking(false)
              setAvatarExpression('neutral')
              useStore.getState().setCurrentViseme(0)
            }}
          />
        </div>
      </div>

        {/* Settings Panel Overlay */}
        <SettingsPanel ttsProvider={ttsProviderRef.current} />
      </div>
    </>
  )
}

export default App
