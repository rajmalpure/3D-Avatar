import { useStore } from '../state/useStore'

export function SessionSummary() {
  const {
    feedbackHistory,
    sessionScore,
    questionCount,
    sessionStartTime,
    setShowSessionSummary,
    resetSession,
    settings,
  } = useStore()

  const duration = sessionStartTime
    ? Math.floor((Date.now() - sessionStartTime) / 1000)
    : 0
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}m ${sec}s`
  }

  const getGrade = (score: number) => {
    if (score >= 90) return { label: 'A+', color: '#00ff88', message: 'Outstanding! You\'re absolutely ready.' }
    if (score >= 80) return { label: 'A', color: '#00e676', message: 'Excellent performance! Very close to ready.' }
    if (score >= 70) return { label: 'B', color: '#ffd740', message: 'Good job! A bit more practice will do it.' }
    if (score >= 60) return { label: 'C', color: '#ffab40', message: 'Decent start. Keep practicing consistently.' }
    return { label: 'D', color: '#ff5252', message: 'Don\'t give up — every expert was once a beginner.' }
  }

  const grade = getGrade(sessionScore)

  // Collect all strengths and improvements from history
  const allStrengths = feedbackHistory.flatMap((f) => f.strengths).slice(0, 4)
  const allImprovements = feedbackHistory.flatMap((f) => f.improvements).slice(0, 4)

  const modeLabel: Record<string, string> = {
    dsa: 'DSA',
    'system-design': 'System Design',
    behavioral: 'Behavioral',
    mixed: 'Mixed',
  }

  return (
    <div className="summary-overlay" id="session-summary-overlay">
      <div className="summary-panel" id="session-summary-panel">
        {/* Header */}
        <div className="summary-header">
          <div className="summary-logo">PrepMate 3D</div>
          <h2>Session Complete!</h2>
          <p className="summary-sub">Here's your performance breakdown</p>
        </div>

        {/* Grade Hero */}
        <div className="grade-hero" style={{ borderColor: grade.color }}>
          <div className="grade-letter" style={{ color: grade.color }}>{grade.label}</div>
          <div className="grade-score">{Math.round(sessionScore)}<span>/100</span></div>
          <p className="grade-message" style={{ color: grade.color }}>{grade.message}</p>
        </div>

        {/* Stats row */}
        <div className="summary-stats">
          <div className="summary-stat">
            <span className="ss-value">{questionCount}</span>
            <span className="ss-label">Questions Answered</span>
          </div>
          <div className="summary-stat">
            <span className="ss-value">{formatTime(duration)}</span>
            <span className="ss-label">Session Duration</span>
          </div>
          <div className="summary-stat">
            <span className="ss-value">{modeLabel[settings.interviewMode]}</span>
            <span className="ss-label">Interview Mode</span>
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="summary-breakdown">
          {allStrengths.length > 0 && (
            <div className="breakdown-col">
              <h4 className="breakdown-title strength-title">✅ Strengths</h4>
              <ul className="breakdown-list">
                {allStrengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {allImprovements.length > 0 && (
            <div className="breakdown-col">
              <h4 className="breakdown-title improve-title">📈 Improve On</h4>
              <ul className="breakdown-list improve-list">
                {allImprovements.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Per-question scores */}
        {feedbackHistory.length > 0 && (
          <div className="question-scores">
            <h4>Per-Question Scores</h4>
            <div className="score-bars">
              {feedbackHistory.map((f, i) => (
                <div key={i} className="score-bar-row">
                  <span className="qnum">Q{i + 1}</span>
                  <div className="bar-bg">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${f.score}%`,
                        background: f.score >= 80 ? '#00e676' : f.score >= 60 ? '#ffd740' : '#ff5252',
                      }}
                    />
                  </div>
                  <span className="qscore">{f.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="summary-actions">
          <button
            id="btn-new-session"
            className="btn-primary-action"
            onClick={() => {
              resetSession()
              setShowSessionSummary(false)
            }}
          >
            🔄 Start New Session
          </button>
          <button
            id="btn-close-summary"
            className="btn-secondary-action"
            onClick={() => setShowSessionSummary(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
