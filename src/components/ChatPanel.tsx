import { useState } from 'react'
import { useStore } from '../state/useStore'

type ChatPanelProps = {
  onSendMessage: (message: string) => void
}

export function ChatPanel({ onSendMessage }: ChatPanelProps) {
  const [inputValue, setInputValue] = useState('')
  const { messages, clearMessages, isProcessing } = useStore()

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
    <div className="chat-panel">
      <div className="chat-header">
        <h2>Chat</h2>
        <button 
          className="btn-clear" 
          onClick={clearMessages}
          title="Clear conversation"
        >
          Clear
        </button>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <p>Start a conversation!</p>
            <p className="chat-hint">Click the mic button or type a message below.</p>
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
              <div className="message-time">{formatTime(msg.timestamp)}</div>
            </div>
          ))
        )}
        {isProcessing && (
          <div className="chat-message assistant processing">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isProcessing}
        />
        <button 
          type="submit" 
          className="btn-send"
          disabled={!inputValue.trim() || isProcessing}
        >
          Send
        </button>
      </form>
    </div>
  )
}
