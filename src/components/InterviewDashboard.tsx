import { useEffect, useState } from 'react'
import { useStore } from '../state/useStore'

const TIPS = [
  'Use the STAR method for behavioral answers',
  'Speak at 130–150 WPM for best clarity',
  'Pause 2–3 seconds before answering — it\'s okay',
  'Quantify your achievements with numbers',
  'Make eye contact with the camera, not the screen',
]

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
  const [tipIndex, setTipIndex] = useState(0)
  const [tipVisible, setTipVisible] = useState(true)

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

  // Rotate tips every 8 seconds with fade
  useEffect(() => {
    const interval = setInterval(() => {
      setTipVisible(false)
      setTimeout(() => {
        setTipIndex(i => (i + 1) % TIPS.length)
        setTipVisible(true)
      }, 400)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60)
    return `${m}m`
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
  const radius = 30
  const circumference = 2 * Math.PI * radius

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

        {/* Score ring in idle state */}
        <div className="score-ring-section">
          <div className="score-ring-wrapper">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r={radius} fill="none" stroke="#1e2433" strokeWidth="6" />
              <circle
                cx="40" cy="40" r={radius}
                fill="none"
                stroke="#7c3aed"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - scorePercent / 100)}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div className="score-ring-overlay">
              <span className="score-ring-number">{sessionScore}</span>
            </div>
          </div>
          <div className="score-ring-label">Session score</div>
        </div>

        {/* Live Metrics 2x2 */}
        <div className="live-metrics-grid">
          <div className="metric-card">
            <span className="metric-value" style={{ color: '#22c55e' }}>{questionCount}</span>
            <span className="metric-label">Questions</span>
          </div>
          <div className="metric-card">
            <span className="metric-value" style={{ color: '#f59e0b' }}>{sessionActive ? formatDuration(elapsed) : '0m'}</span>
            <span className="metric-label">Duration</span>
          </div>
          <div className="metric-card">
            <span className="metric-value" style={{ color: '#60a5fa' }}>85%</span>
            <span className="metric-label">Clarity</span>
          </div>
          <div className="metric-card">
            <span className="metric-value" style={{ color: '#c4b5fd' }}>68%</span>
            <span className="metric-label">Depth</span>
          </div>
        </div>

        {/* Rotating Tips */}
        <div className="rotating-tip-card">
          <div
            className="rotating-tip-text"
            style={{ opacity: tipVisible ? 1 : 0, transition: 'opacity 0.4s ease' }}
          >
            <span className="tip-dot">●</span>
            {TIPS[tipIndex]}
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

      {/* Live Metrics 2x2 */}
      <div className="live-metrics-grid">
        <div className="metric-card">
          <span className="metric-value" style={{ color: '#22c55e' }}>{questionCount}</span>
          <span className="metric-label">Questions</span>
        </div>
        <div className="metric-card">
          <span className="metric-value" style={{ color: '#f59e0b' }}>{formatDuration(elapsed)}</span>
          <span className="metric-label">Duration</span>
        </div>
        <div className="metric-card">
          <span className="metric-value" style={{ color: '#60a5fa' }}>85%</span>
          <span className="metric-label">Clarity</span>
        </div>
        <div className="metric-card">
          <span className="metric-value" style={{ color: '#c4b5fd' }}>68%</span>
          <span className="metric-label">Depth</span>
        </div>
      </div>

      {/* Current question */}
      {currentQuestion && (
        <div className="current-question-card">
          <div className="cq-label">📌 Current Question</div>
          <p className="cq-text">{currentQuestion}</p>
        </div>
      )}

      {/* Rotating Tips */}
      <div className="rotating-tip-card">
        <div
          className="rotating-tip-text"
          style={{ opacity: tipVisible ? 1 : 0, transition: 'opacity 0.4s ease' }}
        >
          <span className="tip-dot">●</span>
          {TIPS[tipIndex]}
        </div>
      </div>
    </aside>
  )
}
