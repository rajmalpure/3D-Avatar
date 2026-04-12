import { useEffect, useState } from 'react'
import { useStore } from '../state/useStore'

export function InterviewDashboard() {
  const {
    sessionActive,
    sessionScore,
    questionCount,
    sessionStartTime,
    currentQuestion,
    settings,
  } = useStore()

  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!sessionActive || !sessionStartTime) {
      setElapsed(0)
      return
    }
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - sessionStartTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [sessionActive, sessionStartTime])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const getGrade = (score: number) => {
    if (score >= 90) return { label: 'A+', color: '#00ff88' }
    if (score >= 80) return { label: 'A', color: '#00e676' }
    if (score >= 70) return { label: 'B', color: '#ffd740' }
    if (score >= 60) return { label: 'C', color: '#ffab40' }
    return { label: 'D', color: '#ff5252' }
  }

  const modeLabel: Record<string, string> = {
    dsa: '⚡ DSA',
    'system-design': '🏗️ System Design',
    behavioral: '🎯 Behavioral',
    mixed: '🔀 Mixed',
  }

  const diffLabel: Record<string, string> = {
    junior: '🟢 Junior',
    mid: '🟡 Mid-Level',
    senior: '🔴 Senior',
  }

  const grade = getGrade(sessionScore)
  const scorePercent = Math.min(sessionScore, 100)

  if (!sessionActive) {
    return (
      <aside className="interview-dashboard idle">
        <div className="dashboard-idle-content">
          <div className="idle-icon">🎯</div>
          <h3>PrepMate 3D</h3>
          <p>Configure your session and click <strong>Start Interview</strong> to begin.</p>
          <div className="idle-badges">
            <span className="badge badge-mode">{modeLabel[settings.interviewMode]}</span>
            <span className="badge badge-diff">{diffLabel[settings.interviewDifficulty]}</span>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className="interview-dashboard active">
      <div className="dashboard-header">
        <span className="live-badge">● LIVE</span>
        <span className="session-timer">{formatTime(elapsed)}</span>
      </div>

      {/* Score Ring */}
      <div className="score-section">
        <div className="score-ring-container">
          <svg className="score-ring" viewBox="0 0 120 120">
            <circle className="ring-bg" cx="60" cy="60" r="50" />
            <circle
              className="ring-fill"
              cx="60"
              cy="60"
              r="50"
              strokeDasharray={`${(scorePercent / 100) * 314} 314`}
              style={{ stroke: grade.color }}
            />
          </svg>
          <div className="score-center">
            <span className="score-value" style={{ color: grade.color }}>{Math.round(scorePercent)}</span>
            <span className="score-label">Score</span>
          </div>
        </div>
        <div className="grade-badge" style={{ background: grade.color + '22', borderColor: grade.color, color: grade.color }}>
          {grade.label}
        </div>
      </div>

      {/* Stats row */}
      <div className="stat-row">
        <div className="stat-item">
          <span className="stat-value">{questionCount}</span>
          <span className="stat-label">Questions</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-value">{modeLabel[settings.interviewMode]}</span>
          <span className="stat-label">Mode</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-value">{diffLabel[settings.interviewDifficulty]}</span>
          <span className="stat-label">Level</span>
        </div>
      </div>

      {/* Current question */}
      {currentQuestion && (
        <div className="current-question-card">
          <div className="cq-label">📌 Current Question</div>
          <p className="cq-text">{currentQuestion}</p>
        </div>
      )}

      {/* Tips */}
      <div className="tips-section">
        <p className="tips-title">💡 Interview Tips</p>
        <ul className="tips-list">
          <li>Think aloud — share your reasoning</li>
          <li>Clarify requirements before coding</li>
          <li>Discuss trade-offs and complexity</li>
          <li>Use the STAR method for behavioral</li>
        </ul>
      </div>
    </aside>
  )
}
