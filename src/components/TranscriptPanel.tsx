import { useEffect, useRef, useState } from 'react'
import { useStore } from '../state/useStore'

type TranscriptPanelProps = {
  onSendMessage: (message: string) => void
}

export function TranscriptPanel({ onSendMessage }: TranscriptPanelProps) {
  const [inputValue, setInputValue] = useState('')
  const { messages, clearMessages, isProcessing, sessionActive } = useStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isProcessing) {
      onSendMessage(inputValue.trim())
      setInputValue('')
    }
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="chat-panel transcript-panel">
      <div className="chat-header">
        <div className="transcript-title">
          <span className="transcript-icon">📝</span>
          <h2>Session Transcript</h2>
        </div>
        <button
          className="btn-clear"
          onClick={clearMessages}
          title="Clear transcript"
          disabled={isProcessing}
        >
          Clear
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <div className="empty-icon">🎙️</div>
            <p>{sessionActive ? 'Session started! Speak your answer...' : 'Click Start Interview to begin.'}</p>
            <p className="chat-hint">Your Q&A conversation will appear here.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message ${msg.role}`}
            >
              <div className="message-content">
                <p>{msg.content}</p>
              </div>
              <div className="message-meta">
                <span className="message-time">{formatTime(msg.timestamp)}</span>
                {msg.role === 'assistant' && typeof msg.score === 'number' && msg.score > 0 && (
                  <span
                    className="score-pill"
                    style={{
                      background: msg.score >= 80 ? '#00e67622' : msg.score >= 60 ? '#ffd74022' : '#ff525222',
                      color: msg.score >= 80 ? '#00e676' : msg.score >= 60 ? '#ffd740' : '#ff5252',
                      borderColor: msg.score >= 80 ? '#00e676' : msg.score >= 60 ? '#ffd740' : '#ff5252',
                    }}
                  >
                    {msg.score}/100
                  </span>
                )}
              </div>
            </div>
          ))
        )}
        {isProcessing && (
          <div className="chat-message assistant processing">
            <div className="message-content">
              <div className="typing-indicator">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          id="transcript-text-input"
          type="text"
          className="chat-input"
          placeholder={sessionActive ? 'Type your answer...' : 'Start a session first...'}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isProcessing || !sessionActive}
        />
        <button
          id="btn-send-message"
          type="submit"
          className="btn-send"
          disabled={!inputValue.trim() || isProcessing || !sessionActive}
        >
          Send
        </button>
      </form>
    </div>
  )
}
