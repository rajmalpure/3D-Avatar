import { describe, it, expect } from 'vitest'
import { 
  getVisemeFromChar, 
  calculateMouthOpening, 
  smoothViseme,
  analyzeAudioForViseme,
  generateVisemeTimeline
} from '../lib/avatar/visemeMapping'

describe('Viseme Mapping', () => {
  describe('getVisemeFromChar', () => {
    it('should map vowels correctly', () => {
      expect(getVisemeFromChar('a')).toBe(1) // ah
      expect(getVisemeFromChar('e')).toBe(7) // eh
      expect(getVisemeFromChar('i')).toBe(11) // ee
      expect(getVisemeFromChar('o')).toBe(12) // oh
      expect(getVisemeFromChar('u')).toBe(14) // uu
    })

    it('should handle uppercase letters', () => {
      expect(getVisemeFromChar('A')).toBe(1)
      expect(getVisemeFromChar('E')).toBe(7)
    })

    it('should return silence for unknown characters', () => {
      expect(getVisemeFromChar('1')).toBe(0)
      expect(getVisemeFromChar('!')).toBe(0)
      expect(getVisemeFromChar(' ')).toBe(0)
    })
  })

  describe('calculateMouthOpening', () => {
    it('should normalize amplitude to mouth opening', () => {
      expect(calculateMouthOpening(0)).toBe(0)
      expect(calculateMouthOpening(0.5)).toBe(0.75)
      expect(calculateMouthOpening(1)).toBe(1)
    })

    it('should clamp values between 0 and 1', () => {
      expect(calculateMouthOpening(-1)).toBe(0)
      expect(calculateMouthOpening(2)).toBe(1)
    })
  })

  describe('smoothViseme', () => {
    it('should interpolate between current and target', () => {
      const result = smoothViseme(0, 10, 0.5)
      expect(result).toBe(5)
    })

    it('should use default smoothing factor', () => {
      const result = smoothViseme(0, 10)
      expect(result).toBeGreaterThan(0)
      expect(result).toBeLessThan(10)
    })

    it('should converge towards target over time', () => {
      let current = 0
      const target = 10
      
      for (let i = 0; i < 10; i++) {
        current = smoothViseme(current, target, 0.2)
      }
      
      expect(current).toBeGreaterThan(8)
      expect(current).toBeLessThanOrEqual(10)
    })
  })

  describe('analyzeAudioForViseme', () => {
    it('should return 0 for silent audio', () => {
      const silentData = new Uint8Array(256).fill(0)
      expect(analyzeAudioForViseme(silentData)).toBe(0)
    })

    it('should return normalized value for audio data', () => {
      const audioData = new Uint8Array(256).fill(128)
      const result = analyzeAudioForViseme(audioData)
      expect(result).toBeGreaterThan(0)
      expect(result).toBeLessThanOrEqual(1)
    })

    it('should return max value for loud audio', () => {
      const loudData = new Uint8Array(256).fill(255)
      const result = analyzeAudioForViseme(loudData)
      expect(result).toBe(1)
    })
  })

  describe('generateVisemeTimeline', () => {
    it('should generate timeline for text', () => {
      const timeline = generateVisemeTimeline('hello', 1000)
      expect(timeline.length).toBeGreaterThan(0)
      expect(timeline[0].time).toBe(0)
    })

    it('should space visemes evenly', () => {
      const text = 'abc'
      const duration = 300
      const timeline = generateVisemeTimeline(text, duration)
      
      expect(timeline.length).toBe(3)
      expect(timeline[0].time).toBe(0)
      expect(timeline[1].time).toBe(100)
      expect(timeline[2].time).toBe(200)
    })

    it('should skip whitespace', () => {
      const timeline = generateVisemeTimeline('a b', 200)
      expect(timeline.length).toBe(2)
    })
  })
})
