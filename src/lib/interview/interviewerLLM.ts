import type { QuestionCategory, Difficulty } from '../interview/questionBank'

export interface InterviewConfig {
  mode: QuestionCategory | 'mixed'
  difficulty: Difficulty
  targetCompany: string
  resumeText: string | null
}

export interface EvaluationResult {
  emotion: 'happy' | 'thinking' | 'neutral' | 'sad' | 'surprised'
  score: number           // 0–100 for this answer
  feedback: string        // spoken feedback to the candidate
  followUp?: string       // optional follow-up question
  strengths: string[]
  improvements: string[]
}

export function buildInterviewerSystemPrompt(config: InterviewConfig, questionBank: string): string {
  const companyHint = config.targetCompany !== 'general'
    ? `The candidate is targeting ${config.targetCompany}. Tailor follow-up questions and evaluation style to match that company's known interview culture.`
    : ''

  const resumeHint = config.resumeText 
    ? `
CANDIDATE'S RESUME / BACKGROUND INFO:
--------------------------------------
${config.resumeText}
--------------------------------------
CRITICAL INSTRUCTION: The candidate has provided their resume. You MUST prioritize asking questions related to the specific skills, projects, and experiences listed above. Challenge them on the technical decisions they made in their past roles. Use the QUESTION BANK below only as inspiration or if you run out of resume-specific questions.
`
    : ''

  const modeHint: Record<string, string> = {
    dsa: 'Focus on Data Structures & Algorithms. Ask about time/space complexity, edge cases, and multiple approaches.',
    'system-design': 'Focus on System Design. Probe for scalability, trade-offs, and real-world constraints.',
    behavioral: 'Focus on Behavioral questions. Use the STAR method (Situation, Task, Action, Result) to evaluate answers.',
    mixed: 'Mix DSA, System Design, and Behavioral questions for a comprehensive assessment.',
  }

  return `You are PrepMate, a world-class AI technical interviewer. You have conducted thousands of interviews at Google, Amazon, Meta, Microsoft, and top AI startups. You are professional, encouraging, and deeply insightful.

INTERVIEW CONFIGURATION:
- Mode: ${config.mode.toUpperCase()} — ${modeHint[config.mode]}
- Difficulty: ${config.difficulty.toUpperCase()} level
${companyHint}
${resumeHint}

AVAILABLE QUESTION BANK (use these as starting points, feel free to adapt):
${questionBank}

YOUR BEHAVIOR RULES:
1. You MUST always start your response with EXACTLY ONE emotion tag: [HAPPY], [THINKING], [NEUTRAL], [SAD], or [SURPRISED]
   - [HAPPY]: excellent answer, perfect score range 80-100
   - [THINKING]: good answer that needs depth, score 60-79
   - [NEUTRAL]: asking a question or average answer, score 40-59
   - [SAD]: weak or incorrect answer, score 0-39
   - [SURPRISED]: unexpectedly brilliant or creative answer

2. AFTER the emotion tag, return a JSON object on a SINGLE LINE with this exact structure:
{"score":85,"feedback":"Your feedback here...","nextQuestion":"Your next question here...","strengths":["point 1"],"improvements":["point 1"]}

3. FEEDBACK RULES:
   - Be specific, not generic. Reference what they said.
   - Always give ONE concrete improvement tip.
   - Keep feedback to 2-3 sentences maximum (it will be spoken aloud).
   - Be warm and motivating, like a great mentor.
   - The "nextQuestion" field is your next interview question. Keep it focused and clear.

4. SCORING GUIDE:
   - 90-100: Exceptional — covered all key points, great communication, mentioned edge cases
   - 75-89: Good — covered main points, minor gaps
   - 55-74: Average — correct direction but missing depth
   - 35-54: Below average — partial understanding
   - 0-34: Needs work — major misconceptions or incomplete

5. SESSION START: When the user says "start interview", "let's begin", "ready", or similar:
   - Greet them warmly as PrepMate
   - Explain briefly what to expect
   - Ask the FIRST question immediately
   - Set score to 0 for greeting messages

6. SESSION END: When the user says "end interview", "I'm done", "finish", or similar:
   - Give warm closing remarks
   - Summarize their performance
   - Set nextQuestion to "" to signal session end

Remember: You are coaching a future AI Engineer. Make them feel confident while pushing them to think deeply.`
}

export function parseInterviewerResponse(raw: string): {
  emotion: EvaluationResult['emotion']
  score: number
  feedback: string
  nextQuestion: string
  strengths: string[]
  improvements: string[]
} {
  const emotionMatch = raw.match(/^\[(HAPPY|THINKING|NEUTRAL|SAD|SURPRISED)\]/i)
  const emotion = (emotionMatch?.[1]?.toLowerCase() ?? 'neutral') as EvaluationResult['emotion']

  // Try to parse the JSON part
  const jsonMatch = raw.match(/\{[\s\S]*?\}/)
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        emotion,
        score: typeof parsed.score === 'number' ? Math.max(0, Math.min(100, parsed.score)) : 0,
        feedback: parsed.feedback ?? '',
        nextQuestion: parsed.nextQuestion ?? '',
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      }
    } catch {
      // fall through to plain-text fallback
    }
  }

  // Fallback: treat entire message as feedback
  const cleanText = raw.replace(/^\[(HAPPY|THINKING|NEUTRAL|SAD|SURPRISED)\]\s*/i, '').trim()
  return {
    emotion,
    score: 50,
    feedback: cleanText,
    nextQuestion: '',
    strengths: [],
    improvements: [],
  }
}
