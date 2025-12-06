import type { LLMProvider } from './types'

export class GeminiLLM implements LLMProvider {
  private apiKey: string
  private model: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY || ''
    this.model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash'
  }

  isSupported(): boolean {
    return !!this.apiKey
  }

  async chat(
    message: string,
    conversationHistory: Array<{role: string, content: string}> = []
  ): Promise<string> {
    if (!this.isSupported()) {
      throw new Error('Gemini API key is not configured')
    }

    try {
      // Convert conversation history to Gemini format
      const contents = conversationHistory
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }))

      // Add current message
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      })

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 150,
              topP: 0.8,
              topK: 40
            },
            safetySettings: [
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              }
            ]
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Gemini API error: ${response.statusText} - ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      
      // Extract text from response
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      
      if (!text) {
        throw new Error('No response generated from Gemini')
      }

      return text
    } catch (error) {
      throw error instanceof Error ? error : new Error('Unknown Gemini API error')
    }
  }
}
