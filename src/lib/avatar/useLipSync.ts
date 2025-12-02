import { useRef, useEffect } from 'react'
import { useStore } from '../../state/useStore'
import { AudioAnalyzer } from './avatarUtils'
import { analyzeAudioForViseme, smoothViseme } from './visemeMapping'

/**
 * Lip sync controller hook
 * Analyzes audio and updates viseme state
 */
export function useLipSync(audioElement: HTMLAudioElement | null) {
  const analyzerRef = useRef<AudioAnalyzer | null>(null)
  const animationFrameRef = useRef<number>()
  const currentVisemeRef = useRef(0)
  
  const { isAvatarSpeaking, setCurrentViseme } = useStore()

  useEffect(() => {
    if (!audioElement || !isAvatarSpeaking) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      setCurrentViseme(0)
      currentVisemeRef.current = 0
      return
    }

    // Initialize analyzer
    if (!analyzerRef.current) {
      analyzerRef.current = new AudioAnalyzer()
    }

    analyzerRef.current.connectAudioElement(audioElement)

    // Animation loop
    const animate = () => {
      if (!analyzerRef.current) return

      const frequencyData = analyzerRef.current.getFrequencyData()
      if (frequencyData) {
        const targetViseme = analyzeAudioForViseme(frequencyData)
        const smoothed = smoothViseme(currentVisemeRef.current, targetViseme, 0.15)
        currentVisemeRef.current = smoothed
        setCurrentViseme(smoothed)
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (analyzerRef.current) {
        analyzerRef.current.disconnect()
      }
    }
  }, [audioElement, isAvatarSpeaking, setCurrentViseme])

  return null
}
