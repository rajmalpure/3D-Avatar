import { useEffect, useRef, useState } from 'react'
import { useStore } from '../state/useStore'

type TranscriptPanelProps = {
  onSendMessage: (message: string) => void
}

export function TranscriptPanel({ onSendMessage }: TranscriptPanelProps) {
  const [inputValue, setInputValue] = useState('')
  const [activeTab, setActiveTab] = useState<'transcript' | 'feedback' | 'notes'>('transcript')
  const [notes, setNotes] = useState(() => localStorage.getItem('prepmate_notes') || '')
  const { messages, clearMessages, isProcessing, sessionActive, feedbackHistory } = useStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    localStorage.setItem('prepmate_notes', notes)
  }, [notes])

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

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#4ade80'
    if (score >= 70) return '#facc15'
    return '#f87171'
  }

  return (
    <div className="chat-panel transcript-panel">
      {/* Tabs */}
      <div className="transcript-tabs">
        {(['transcript', 'feedback', 'notes'] as const).map(tab => (
          <button
            key={tab}
            className={`transcript-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'transcript' ? '📝 Transcript' : tab === 'feedback' ? '⭐ Feedback' : '📓 Notes'}
          </button>
        ))}
      </div>

      {/* TRANSCRIPT TAB */}
      {activeTab === 'transcript' && (
        <>
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
                <div key={msg.id} className={`chat-message ${msg.role}`}>
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
                        ★ {msg.score}/100
                      </span>
                    )}
                  </div>
                  {/* Inline feedback tags */}
                  {msg.role === 'assistant' && (msg.strengths?.length || msg.improvements?.length) && (
                    <div className="inline-feedback-tags">
                      {msg.strengths?.slice(0, 2).map((s, i) => (
                        <span key={i} className="feedback-tag strength">{s}</span>
                      ))}
                      {msg.improvements?.slice(0, 2).map((imp, i) => (
                        <span key={i} className="feedback-tag improvement">{imp}</span>
                      ))}
                    </div>
                  )}
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
        </>
      )}

      {/* FEEDBACK TAB */}
      {activeTab === 'feedback' && (
        <div className="feedback-tab-content">
          {(!feedbackHistory || feedbackHistory.length === 0) ? (
            <div className="chat-empty">
              <div className="empty-icon">⭐</div>
              <p>No feedback yet — start a session first</p>
            </div>
          ) : (
            <div className="feedback-list">
              {feedbackHistory.map((item, i) => (
                <div key={i} className="feedback-item-card">
                  <div className="feedback-item-header">
                    <p className="feedback-question">
                      {item.question?.slice(0, 60)}{(item.question?.length ?? 0) > 60 ? '...' : ''}
                    </p>
                    <span
                      className="feedback-score-badge"
                      style={{ color: getScoreColor(item.score), background: getScoreColor(item.score) + '22', border: `1px solid ${getScoreColor(item.score)}` }}
                    >
                      {item.score}/100
                    </span>
                  </div>
                  <div className="feedback-pills">
                    {item.strengths?.map((s, j) => (
                      <span key={j} className="feedback-tag strength">{s}</span>
                    ))}
                    {item.improvements?.map((imp, j) => (
                      <span key={j} className="feedback-tag improvement">{imp}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* NOTES TAB */}
      {activeTab === 'notes' && (
        <div className="notes-tab-content">
          <textarea
            className="notes-textarea"
            placeholder="Jot down notes during your session..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      )}
    </div>
  )
}
