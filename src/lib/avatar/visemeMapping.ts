/**
 * Maps text phonemes to viseme indices for facial animation
 * Visemes are the visual representation of phonemes
 */

export const VISEME_MAP: Record<string, number> = {
  // Silence
  'sil': 0,
  
  // Vowels
  'AA': 1, 'aa': 1, 'ah': 1,  // father
  'AE': 2, 'ae': 2,            // cat
  'AH': 3, 'uh': 3,            // cut
  'AO': 4, 'ao': 4, 'aw': 4,   // dog
  'AW': 5, 'ow': 5,            // how
  'AY': 6, 'ay': 6,            // my
  'EH': 7, 'eh': 7,            // bed
  'ER': 8, 'er': 8,            // bird
  'EY': 9, 'ey': 9,            // ate
  'IH': 10, 'ih': 10,          // it
  'IY': 11, 'iy': 11, 'ee': 11, // eat
  'OW': 12, 'oh': 12,          // go
  'OY': 13, 'oy': 13,          // toy
  'UH': 14, 'uu': 14,          // book
  'UW': 15, 'uw': 15, 'oo': 15, // too
  
  // Consonants
  'B': 16, 'b': 16, 'P': 16, 'p': 16, 'M': 16, 'm': 16,  // Bilabial
  'F': 17, 'f': 17, 'V': 17, 'v': 17,                    // Labiodental
  'TH': 18, 'th': 18, 'DH': 18, 'dh': 18,                // Dental
  'T': 19, 't': 19, 'D': 19, 'd': 19,                    // Alveolar
  'S': 20, 's': 20, 'Z': 20, 'z': 20,                    // Fricative
  'SH': 21, 'sh': 21, 'ZH': 21, 'zh': 21, 'CH': 21, 'ch': 21, // Postalveolar
  'K': 22, 'k': 22, 'G': 22, 'g': 22, 'NG': 22, 'ng': 22, // Velar
  'L': 23, 'l': 23,                                       // Lateral
  'R': 24, 'r': 24,                                       // Rhotic
  'W': 25, 'w': 25,                                       // Glide
  'Y': 26, 'y': 26, 'j': 26,                             // Palatal
}

/**
 * Approximate viseme from text character
 */
export function getVisemeFromChar(char: string): number {
  const lower = char.toLowerCase()
  
  // Vowels
  if ('aeiou'.includes(lower)) {
    switch (lower) {
      case 'a': return VISEME_MAP['ah']
      case 'e': return VISEME_MAP['eh']
      case 'i': return VISEME_MAP['ee']
      case 'o': return VISEME_MAP['oh']
      case 'u': return VISEME_MAP['uu']
    }
  }
  
  // Consonants
  if (VISEME_MAP[lower] !== undefined) {
    return VISEME_MAP[lower]
  }
  
  // Default to silence
  return 0
}

/**
 * Calculate mouth opening based on audio amplitude
 */
export function calculateMouthOpening(amplitude: number): number {
  // Normalize amplitude (0-1) to mouth opening (0-1)
  return Math.min(Math.max(amplitude * 1.5, 0), 1)
}

/**
 * Smooth transition between viseme values
 */
export function smoothViseme(current: number, target: number, smoothing: number = 0.15): number {
  return current + (target - current) * smoothing
}

/**
 * Map audio frequency data to viseme intensity
 */
export function analyzeAudioForViseme(frequencyData: Uint8Array): number {
  // Focus on speech frequency range (85-255 Hz for fundamental frequency)
  // and (1000-4000 Hz for formants)
  
  let sum = 0
  let count = 0
  
  // Sample mid-range frequencies (typical for speech)
  const start = Math.floor(frequencyData.length * 0.1)
  const end = Math.floor(frequencyData.length * 0.5)
  
  for (let i = start; i < end; i++) {
    sum += frequencyData[i]
    count++
  }
  
  const average = count > 0 ? sum / count : 0
  return average / 255 // Normalize to 0-1
}

/**
 * Generate viseme timeline from text (simplified)
 */
export function generateVisemeTimeline(text: string, duration: number): Array<{time: number, viseme: number}> {
  const chars = text.split('')
  const timeline: Array<{time: number, viseme: number}> = []
  const timePerChar = duration / chars.length
  
  chars.forEach((char, index) => {
    if (char.trim()) {
      timeline.push({
        time: index * timePerChar,
        viseme: getVisemeFromChar(char)
      })
    }
  })
  
  return timeline
}
