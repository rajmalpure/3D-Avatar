import { useEffect, useState } from 'react'
import { useStore } from '../state/useStore'
import type { TTSProvider as TTSProviderType, LLMProvider as LLMProviderType } from '../state/useStore'

type SettingsPanelProps = {
  ttsProvider: any
}

export function SettingsPanel({ ttsProvider }: SettingsPanelProps) {
  const { 
    showSettings, 
    setShowSettings, 
    settings, 
    updateSettings 
  } = useStore()
  
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    if (ttsProvider && ttsProvider.getVoices) {
      const loadVoices = () => {
        const voices = ttsProvider.getVoices()
        setAvailableVoices(voices)
      }

      loadVoices()
      
      // Chrome loads voices asynchronously
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }
    }
  }, [ttsProvider])

  if (!showSettings) return null

  return (
    <div className="settings-overlay" onClick={() => setShowSettings(false)}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button 
            className="btn-close"
            onClick={() => setShowSettings(false)}
          >
            ×
          </button>
        </div>
        
        <div className="settings-content">
          {/* TTS Provider */}
          <div className="setting-group">
            <label>TTS Provider</label>
            <select 
              value={settings.ttsProvider}
              onChange={(e) => updateSettings({ 
                ttsProvider: e.target.value as TTSProviderType 
              })}
            >
              <option value="webspeech">Web Speech API</option>
            </select>
          </div>

          {/* Voice Selection (Web Speech only) */}
          {settings.ttsProvider === 'webspeech' && availableVoices.length > 0 && (
            <div className="setting-group">
              <label>Voice</label>
              <select 
                value={settings.ttsVoice}
                onChange={(e) => updateSettings({ ttsVoice: e.target.value })}
              >
                <option value="">Default</option>
                {availableVoices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* TTS Volume */}
          <div className="setting-group">
            <label>Volume: {Math.round(settings.ttsVolume * 100)}%</label>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.ttsVolume}
              onChange={(e) => updateSettings({ 
                ttsVolume: parseFloat(e.target.value) 
              })}
            />
          </div>

          {/* TTS Speed */}
          <div className="setting-group">
            <label>Speech Speed: {settings.ttsSpeed.toFixed(1)}x</label>
            <input 
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.ttsSpeed}
              onChange={(e) => updateSettings({ 
                ttsSpeed: parseFloat(e.target.value) 
              })}
            />
          </div>

          {/* LLM Provider */}
          <div className="setting-group">
            <label>LLM Provider</label>
            <select 
              value={settings.llmProvider}
              onChange={(e) => updateSettings({ 
                llmProvider: e.target.value as LLMProviderType
              })}
            >
              <option value="local">Local (Basic Responses)</option>
              <option value="gemini">Google Gemini</option>
            </select>
            <small className="setting-hint">
              {settings.llmProvider === 'gemini' && 'Requires Gemini API key in .env'}
            </small>
          </div>

          {/* Avatar Model */}
          <div className="setting-group">
            <label>Avatar Model</label>
            <select 
              value={settings.avatarModel}
              onChange={(e) => updateSettings({ avatarModel: e.target.value })}
            >
              <option value="default">Default Avatar</option>
            </select>
            <small className="setting-hint">
              Add custom GLB models to /public folder
            </small>
          </div>
        </div>

        <div className="settings-footer">
          <p className="settings-info">
            💡 Changes apply immediately. Reload page if issues occur.
          </p>
        </div>
      </div>
    </div>
  )
}
