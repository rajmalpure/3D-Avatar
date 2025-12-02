import { useEffect, useRef } from 'react'
import { AvatarScene } from './components/AvatarScene'
import { ChatPanel } from './components/ChatPanel'
import { MicButton } from './components/MicButton'
import { SettingsPanel } from './components/SettingsPanel'
import { useStore } from './state/useStore'
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
    setIsProcessing
  } = useStore()
  
  const ttsProviderRef = useRef<TTSProvider | null>(null)
  const llmProviderRef = useRef<LLMProvider | null>(null)

  // Initialize providers
  useEffect(() => {
    ttsProviderRef.current = createTTSProvider()
    llmProviderRef.current = createLLMProvider(settings.llmProvider)
  }, [settings.llmProvider])

  const handleSendMessage = async (userMessage: string) => {
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

      // Convert messages to conversation history
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await llmProvider.chat(userMessage, history)

      // Add assistant message
      addMessage({
        role: 'assistant',
        content: response
      })

      setIsProcessing(false)
      
      // Speak the response
      await speakResponse(response)

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
      setAvatarExpression('speaking')

      await ttsProvider.speak(text, {
        voice: settings.ttsVoice,
        rate: settings.ttsSpeed,
        volume: settings.ttsVolume,
        onStart: () => {
          setIsAvatarSpeaking(true)
          setAvatarExpression('speaking')
        },
        onEnd: () => {
          setIsAvatarSpeaking(false)
          setAvatarExpression('neutral')
        }
      })
    } catch (error) {
      console.error('TTS error:', error)
      setIsAvatarSpeaking(false)
      setAvatarExpression('neutral')
    }
  }

  const handleTranscript = (transcript: string) => {
    if (transcript.trim()) {
      handleSendMessage(transcript)
    }
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1>3D AI Avatar Assistant</h1>
        <button 
          className="btn-settings"
          onClick={() => setShowSettings(true)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="3" strokeWidth="2" />
            <path d="M12 1v6m0 6v6M5.6 5.6l4.2 4.2m4.2 4.2l4.2 4.2M1 12h6m6 0h6M5.6 18.4l4.2-4.2m4.2-4.2l4.2-4.2" strokeWidth="2" />
          </svg>
          Settings
        </button>
      </header>

      {/* Main content */}
      <div className="app-content">
        {/* Avatar Scene */}
        <div className="avatar-container">
          <AvatarScene />
        </div>

        {/* Chat Interface */}
        <aside className="chat-container">
          <ChatPanel onSendMessage={handleSendMessage} />
        </aside>
      </div>

      {/* Mic Button */}
      <div className="mic-container">
        <MicButton onTranscript={handleTranscript} />
      </div>

      {/* Settings Panel */}
      <SettingsPanel ttsProvider={ttsProviderRef.current} />
    </div>
  )
}

export default App
