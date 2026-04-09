export interface LLMProvider {
  chat(message: string, conversationHistory?: Array<{role: string, content: string}>, systemPrompt?: string): Promise<string>
  isSupported(): boolean
}
