import { useState, useEffect, useRef } from 'react'
import { useStore } from '../state/useStore'
import { WebSpeechSTT } from '../lib/stt/webSpeechSTT'

type MicButtonProps = {
  onTranscript: (text: string) => void
}

export function MicButton({ onTranscript }: MicButtonProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState('')
  const sttRef = useRef<WebSpeechSTT | null>(null)
  
  const { setIsListening, isProcessing } = useStore()

  useEffect(() => {
    sttRef.current = new WebSpeechSTT()
    
    return () => {
      if (sttRef.current && isRecording) {
        sttRef.current.stopListening()
      }
    }
  }, [])

  const handleMicClick = async () => {
    if (!sttRef.current) return

    if (isRecording) {
      // Stop recording
      sttRef.current.stopListening()
      setIsRecording(false)
      setIsListening(false)
      setInterimTranscript('')
    } else {
      // Start recording
      if (!sttRef.current.isSupported()) {
        alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.')
        return
      }

      try {
        setIsRecording(true)
        setIsListening(true)
        
        await sttRef.current.startListening({
          language: 'en-US',
          continuous: false,
          interimResults: true,
          onResult: (transcript, isFinal) => {
            if (isFinal) {
              onTranscript(transcript)
              setIsRecording(false)
              setIsListening(false)
              setInterimTranscript('')
            } else {
              setInterimTranscript(transcript)
            }
          },
          onError: (error) => {
            console.error('Speech recognition error:', error)
            setIsRecording(false)
            setIsListening(false)
            setInterimTranscript('')
            
            if (error === 'not-allowed') {
              alert('Microphone access denied. Please allow microphone access in your browser settings.')
            }
          },
          onEnd: () => {
            setIsRecording(false)
            setIsListening(false)
            setInterimTranscript('')
          }
        })
      } catch (error) {
        console.error('Failed to start recording:', error)
        setIsRecording(false)
        setIsListening(false)
      }
    }
  }

  return (
    <div className="mic-button-container">
      <button
        className={`mic-button ${isRecording ? 'recording' : ''}`}
        onClick={handleMicClick}
        disabled={isProcessing}
        title={isRecording ? 'Stop recording' : 'Start recording'}
      >
        <svg 
          className="mic-icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
        >
          {isRecording ? (
            <rect x="6" y="6" width="12" height="12" rx="2" strokeWidth="2" />
          ) : (
            <>
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" strokeWidth="2" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeWidth="2" />
              <line x1="12" y1="19" x2="12" y2="23" strokeWidth="2" />
              <line x1="8" y1="23" x2="16" y2="23" strokeWidth="2" />
            </>
          )}
        </svg>
      </button>
      
      {interimTranscript && (
        <div className="interim-transcript">
          {interimTranscript}
        </div>
      )}
      
      {isRecording && (
        <div className="recording-indicator">
          <span className="pulse"></span>
          Listening...
        </div>
      )}
    </div>
  )
}
