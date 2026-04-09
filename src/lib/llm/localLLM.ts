import type { LLMProvider } from './types'

export class LocalLLM implements LLMProvider {
  private responses = [
    "That's an interesting question. Let me think about that.",
    "I understand what you're asking. Here's what I think:",
    "That's a great point! From my perspective,",
    "I'd be happy to help you with that.",
    "Let me provide some insights on that topic.",
    "Based on what you've shared, I can offer this perspective:",
    "That's worth exploring. Here's my take:",
    "I appreciate you asking that. Let me explain:",
  ]

  private contextualResponses: Record<string, string[]> = {
    greeting: [
      "Hello! It's great to see you. How can I assist you today?",
      "Hi there! What can I help you with?",
      "Hey! I'm here to help. What's on your mind?",
    ],
    thanks: [
      "You're very welcome! Feel free to ask me anything else.",
      "Happy to help! Is there anything else you'd like to know?",
      "My pleasure! Let me know if you need anything else.",
    ],
    help: [
      "I'm here to assist you! You can ask me questions, have a conversation, or just chat. What would you like to talk about?",
      "I can help with various topics. Just ask me anything you'd like to know!",
      "Feel free to ask me any questions. I'm here to help and have a conversation with you.",
    ],
  }

  isSupported(): boolean {
    return true
  }

  async chat(message: string, conversationHistory?: Array<{role: string, content: string}>, systemPrompt?: string): Promise<string> {
    // Simple pattern matching for common queries
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
      return this.getRandomResponse(this.contextualResponses.greeting)
    }

    if (lowerMessage.match(/(thank|thanks|thx)/)) {
      return this.getRandomResponse(this.contextualResponses.thanks)
    }

    if (lowerMessage.match(/(help|what can you do|how does this work)/)) {
      return this.getRandomResponse(this.contextualResponses.help)
    }

    // Time-based queries
    if (lowerMessage.match(/time|clock/)) {
      const now = new Date()
      return `The current time is ${now.toLocaleTimeString()}.`
    }

    // Date-based queries
    if (lowerMessage.match(/date|day|today/)) {
      const now = new Date()
      return `Today is ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`
    }

    // Default response with echo
    const response = this.getRandomResponse(this.responses)
    const emotionTags = ['[HAPPY]', '[THINKING]', '[NEUTRAL]']
    const randomEmotion = emotionTags[Math.floor(Math.random() * emotionTags.length)]
    
    return `${randomEmotion} ${response} You mentioned: "${message}". This is a local response since no external LLM is configured. To enable advanced AI responses, configure OpenAI API key in your environment settings.`
  }

  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)]
  }
}
