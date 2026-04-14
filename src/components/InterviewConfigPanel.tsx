import { useState } from 'react'
import { useStore } from '../state/useStore'
import type { InterviewMode, InterviewDifficulty, TargetCompany } from '../state/useStore'
import { extractTextFromPDF } from '../lib/utils/pdfParser'
import { scrapeJobUrl } from '../lib/utils/scraper'

export function InterviewConfigPanel() {
  const { showSettings, setShowSettings, settings, updateSettings } = useStore()
  const [availableVoices] = useState<SpeechSynthesisVoice[]>(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      return window.speechSynthesis.getVoices()
    }
    return []
  })
  
  const [isUploading, setIsUploading] = useState(false)
  const [jobUrlInput, setJobUrlInput] = useState('')
  const [isScraping, setIsScraping] = useState(false)

  const handleTargetRoleScrape = async () => {
    const input = jobUrlInput.trim()
    if (!input) return
    
    // Check if it's likely a URL
    if (input.startsWith('http') && !input.includes(' ')) {
      try {
        setIsScraping(true)
        const scrapedText = await scrapeJobUrl(input)
        updateSettings({ jobDescription: scrapedText })
        setJobUrlInput('')
      } catch (err) {
        alert('Failed to scrape the URL. The site might be blocking access. Try pasting the raw job description text directly into this box instead!')
      } finally {
        setIsScraping(false)
      }
    } else {
      // It's raw text
      updateSettings({ jobDescription: input.slice(0, 15000) })
      setJobUrlInput('')
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      
      let text = ''
      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file)
      } else {
        text = await file.text()
      }
      
      // Limit to ~3000 words logic safely
      const limitedText = text.slice(0, 15000)
      updateSettings({ resumeText: limitedText })
    } catch (err) {
      console.error('Error reading resume:', err)
      alert('Failed to parse the resume file. Try again or use a .txt file.')
    } finally {
      setIsUploading(false)
    }
  }

  if (!showSettings) return null

  return (
    <div className="settings-overlay" onClick={() => setShowSettings(false)}>
      <div className="settings-panel config-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <div className="config-panel-title">
            <span className="config-icon">⚙️</span>
            <h2>Interview Setup</h2>
          </div>
          <button className="btn-close" onClick={() => setShowSettings(false)}>×</button>
        </div>

        <div className="settings-content">
        
          {/* Resume Upload */}
          <div className="setting-group resume-upload-group">
            <label>📄 Resume / Context (Optional)</label>
            <div className="resume-uploader">
              {!settings.resumeText ? (
                <>
                  <input 
                    type="file" 
                    id="resume-upload" 
                    accept=".pdf,.txt,.md" 
                    onChange={handleFileUpload} 
                    disabled={isUploading}
                    className="file-input-hidden"
                  />
                  <label htmlFor="resume-upload" className="file-upload-btn">
                    {isUploading ? '⏳ Parsing...' : 'Upload PDF or TXT'}
                  </label>
                  <span className="upload-hint">Upload your resume to get tailored questions.</span>
                </>
              ) : (
                <div className="resume-loaded">
                  <span className="loaded-icon">✅</span>
                  <span className="loaded-text">Resume Loaded</span>
                  <button 
                    className="btn-remove-resume" 
                    onClick={() => updateSettings({ resumeText: null })}
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>
          <hr className="divider" />

          {/* Job URL Scraper */}
          <div className="setting-group job-scrape-group">
            <label>🔗 Target Role (Job URL or raw text)</label>
            <div className="job-scraper">
              {!settings.jobDescription ? (
                <div className="job-url-input-wrap">
                  <textarea 
                    placeholder="Paste a Greenhouse/Lever job URL, OR paste the raw job description text here..."
                    value={jobUrlInput}
                    onChange={(e) => setJobUrlInput(e.target.value)}
                    disabled={isScraping}
                    className="job-url-input job-text-area"
                    rows={3}
                  />
                  <button 
                    className="btn-scrape" 
                    onClick={handleTargetRoleScrape}
                    disabled={isScraping || !jobUrlInput}
                  >
                    {isScraping ? '⏳...' : 'Save'}
                  </button>
                </div>
              ) : (
                <div className="resume-loaded job-loaded">
                  <span className="loaded-icon">🎯</span>
                  <span className="loaded-text">Target Role Loaded</span>
                  <button 
                    className="btn-remove-resume btn-remove-job" 
                    onClick={() => updateSettings({ jobDescription: null })}
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
            {!settings.jobDescription && (
              <span className="upload-hint">Paste an active job posting for hyper-specific tailored questions.</span>
            )}
          </div>
          <hr className="divider" />

          {/* Interview Mode */}
          <div className="setting-group">
            <label>🎯 Interview Mode</label>
            <div className="mode-grid">
              {([
                { value: 'dsa', label: 'DSA', icon: '⚡', desc: 'Data Structures & Algorithms' },
                { value: 'system-design', label: 'System Design', icon: '🏗️', desc: 'Architecture & Scalability' },
                { value: 'behavioral', label: 'Behavioral', icon: '🎯', desc: 'STAR-based soft skills' },
                { value: 'mixed', label: 'Mixed', icon: '🔀', desc: 'All question types' },
              ] as { value: InterviewMode; label: string; icon: string; desc: string }[]).map((m) => (
                <button
                  key={m.value}
                  id={`mode-btn-${m.value}`}
                  className={`mode-card ${settings.interviewMode === m.value ? 'selected' : ''}`}
                  onClick={() => updateSettings({ interviewMode: m.value })}
                >
                  <span className="mode-icon">{m.icon}</span>
                  <span className="mode-label">{m.label}</span>
                  <span className="mode-desc">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="setting-group">
            <label>📊 Difficulty Level</label>
            <div className="difficulty-pills">
              {([
                { value: 'junior', label: '🟢 Junior (0–2 yrs)', color: '#00e676' },
                { value: 'mid', label: '🟡 Mid-Level (2–5 yrs)', color: '#ffd740' },
                { value: 'senior', label: '🔴 Senior (5+ yrs)', color: '#ff5252' },
              ] as { value: InterviewDifficulty; label: string; color: string }[]).map((d) => (
                <button
                  key={d.value}
                  id={`diff-btn-${d.value}`}
                  className={`diff-pill ${settings.interviewDifficulty === d.value ? 'selected' : ''}`}
                  style={settings.interviewDifficulty === d.value ? { borderColor: d.color, color: d.color } : {}}
                  onClick={() => updateSettings({ interviewDifficulty: d.value })}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target Company */}
          <div className="setting-group">
            <label>🏢 Target Company</label>
            <select
              id="target-company-select"
              value={settings.targetCompany}
              onChange={(e) => updateSettings({ targetCompany: e.target.value as TargetCompany })}
            >
              <option value="general">🌐 General Tech</option>
              <option value="google">🔵 Google / DeepMind</option>
              <option value="amazon">🟡 Amazon / AWS</option>
              <option value="meta">🔵 Meta / FAIR</option>
              <option value="microsoft">🟣 Microsoft / OpenAI</option>
              <option value="apple">⚫ Apple</option>
              <option value="startup">🚀 AI Startup</option>
            </select>
          </div>

          <hr className="divider" />

          {/* Voice */}
          <div className="setting-group">
            <label>🔊 Voice Speed: {settings.ttsSpeed.toFixed(1)}x</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.ttsSpeed}
              onChange={(e) => updateSettings({ ttsSpeed: parseFloat(e.target.value) })}
            />
          </div>

          <div className="setting-group">
            <label>🔉 Volume: {Math.round(settings.ttsVolume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.ttsVolume}
              onChange={(e) => updateSettings({ ttsVolume: parseFloat(e.target.value) })}
            />
          </div>

          {availableVoices.length > 0 && (
            <div className="setting-group">
              <label>🎙️ AI Voice</label>
              <select
                id="voice-select"
                value={settings.ttsVoice}
                onChange={(e) => updateSettings({ ttsVoice: e.target.value })}
              >
                <option value="">Default</option>
                {availableVoices.map((v) => (
                  <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                ))}
              </select>
            </div>
          )}

          {/* LLM Provider */}
          <div className="setting-group">
            <label>🧠 AI Engine</label>
            <select
              id="llm-provider-select"
              value={settings.llmProvider}
              onChange={(e) => updateSettings({ llmProvider: e.target.value as 'local' | 'gemini' })}
            >
              <option value="gemini">Google Gemini (Recommended)</option>
              <option value="local">Local (Offline Demo)</option>
            </select>
            {settings.llmProvider === 'gemini' && (
              <small className="setting-hint">Uses your VITE_GEMINI_API_KEY from .env</small>
            )}
          </div>
        </div>

        <div className="settings-footer">
          <button
            id="btn-save-config"
            className="btn-save-config"
            onClick={() => setShowSettings(false)}
          >
            ✅ Save & Close
          </button>
        </div>
      </div>
    </div>
  )
}
