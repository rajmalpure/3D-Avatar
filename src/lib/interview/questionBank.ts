export type QuestionCategory = 'dsa' | 'system-design' | 'behavioral'
export type Difficulty = 'junior' | 'mid' | 'senior'

export interface InterviewQuestion {
  id: string
  category: QuestionCategory
  difficulty: Difficulty
  question: string
  tags: string[]
  hint?: string
}

export const QUESTION_BANK: InterviewQuestion[] = [
  // ─── DSA — Junior ───────────────────────────────────────────────
  {
    id: 'dsa-j-1',
    category: 'dsa',
    difficulty: 'junior',
    question: 'Given an array of integers, find the two numbers that add up to a target sum. What is the time complexity of your approach?',
    tags: ['arrays', 'hash-map', 'two-sum'],
  },
  {
    id: 'dsa-j-2',
    category: 'dsa',
    difficulty: 'junior',
    question: 'How would you reverse a linked list? Walk me through your algorithm step by step.',
    tags: ['linked-list', 'pointers'],
  },
  {
    id: 'dsa-j-3',
    category: 'dsa',
    difficulty: 'junior',
    question: 'Explain the difference between a stack and a queue. Give a real-world use case for each.',
    tags: ['stack', 'queue', 'data-structures'],
  },
  {
    id: 'dsa-j-4',
    category: 'dsa',
    difficulty: 'junior',
    question: 'Write a function to check if a string is a palindrome. Can you do it without using extra space?',
    tags: ['strings', 'two-pointer'],
  },
  {
    id: 'dsa-j-5',
    category: 'dsa',
    difficulty: 'junior',
    question: 'What is Big O notation? Explain O(1), O(n), O(n²) with examples.',
    tags: ['complexity', 'fundamentals'],
  },

  // ─── DSA — Mid ─────────────────────────────────────────────────
  {
    id: 'dsa-m-1',
    category: 'dsa',
    difficulty: 'mid',
    question: 'Given a binary tree, find the lowest common ancestor of two given nodes. What is your approach?',
    tags: ['binary-tree', 'recursion', 'lca'],
  },
  {
    id: 'dsa-m-2',
    category: 'dsa',
    difficulty: 'mid',
    question: 'Implement a function to find all subsets of a set. How would you handle duplicates?',
    tags: ['backtracking', 'subsets', 'recursion'],
  },
  {
    id: 'dsa-m-3',
    category: 'dsa',
    difficulty: 'mid',
    question: 'Explain dynamic programming. Solve the coin change problem and analyze its complexity.',
    tags: ['dynamic-programming', 'coin-change'],
  },
  {
    id: 'dsa-m-4',
    category: 'dsa',
    difficulty: 'mid',
    question: 'Given a graph, how would you detect a cycle? Describe both directed and undirected graph approaches.',
    tags: ['graph', 'dfs', 'cycle-detection'],
  },
  {
    id: 'dsa-m-5',
    category: 'dsa',
    difficulty: 'mid',
    question: 'Implement a LRU (Least Recently Used) cache with O(1) get and put operations.',
    tags: ['design', 'hash-map', 'doubly-linked-list', 'lru'],
  },

  // ─── DSA — Senior ──────────────────────────────────────────────
  {
    id: 'dsa-s-1',
    category: 'dsa',
    difficulty: 'senior',
    question: 'Design an algorithm to find the median of a stream of integers in O(log n) time.',
    tags: ['heap', 'median', 'streaming'],
  },
  {
    id: 'dsa-s-2',
    category: 'dsa',
    difficulty: 'senior',
    question: 'Solve the "Trapping Rain Water" problem. Walk me through multiple approaches and their trade-offs.',
    tags: ['arrays', 'two-pointer', 'stack', 'rain-water'],
  },
  {
    id: 'dsa-s-3',
    category: 'dsa',
    difficulty: 'senior',
    question: 'Implement a Trie and explain how you would extend it to support autocomplete with frequency ranking.',
    tags: ['trie', 'strings', 'design'],
  },
  {
    id: 'dsa-s-4',
    category: 'dsa',
    difficulty: 'senior',
    question: 'Given a weighted directed graph, implement Dijkstra\'s algorithm. When would you prefer Bellman-Ford?',
    tags: ['graph', 'shortest-path', 'dijkstra'],
  },

  // ─── System Design — Junior ─────────────────────────────────────
  {
    id: 'sd-j-1',
    category: 'system-design',
    difficulty: 'junior',
    question: 'How would you design a URL shortener like bit.ly? Start with the basic requirements.',
    tags: ['url-shortener', 'database', 'hashing'],
  },
  {
    id: 'sd-j-2',
    category: 'system-design',
    difficulty: 'junior',
    question: 'Explain the difference between SQL and NoSQL databases. When would you choose one over the other?',
    tags: ['databases', 'sql', 'nosql'],
  },
  {
    id: 'sd-j-3',
    category: 'system-design',
    difficulty: 'junior',
    question: 'What is a REST API? Design the endpoints for a simple blog application.',
    tags: ['rest', 'api-design', 'http'],
  },

  // ─── System Design — Mid ────────────────────────────────────────
  {
    id: 'sd-m-1',
    category: 'system-design',
    difficulty: 'mid',
    question: 'Design a rate limiter. What algorithms would you consider and what are the trade-offs?',
    tags: ['rate-limiting', 'distributed', 'algorithms'],
  },
  {
    id: 'sd-m-2',
    category: 'system-design',
    difficulty: 'mid',
    question: 'How would you design a notification system that handles 10 million users? Consider push, email, and SMS.',
    tags: ['notification', 'scalability', 'queues'],
  },
  {
    id: 'sd-m-3',
    category: 'system-design',
    difficulty: 'mid',
    question: 'Design a distributed cache. How do you handle cache invalidation and consistency?',
    tags: ['caching', 'redis', 'distributed'],
  },
  {
    id: 'sd-m-4',
    category: 'system-design',
    difficulty: 'mid',
    question: 'How would you design a search autocomplete feature for an e-commerce platform serving millions?',
    tags: ['autocomplete', 'search', 'trie', 'caching'],
  },

  // ─── System Design — Senior ─────────────────────────────────────
  {
    id: 'sd-s-1',
    category: 'system-design',
    difficulty: 'senior',
    question: 'Design YouTube or a video streaming service at scale. Focus on storage, CDN, and encoding pipeline.',
    tags: ['video-streaming', 'cdn', 'storage', 'encoding'],
  },
  {
    id: 'sd-s-2',
    category: 'system-design',
    difficulty: 'senior',
    question: 'Design a distributed message queue like Kafka. How do you guarantee at-least-once delivery?',
    tags: ['kafka', 'message-queue', 'distributed', 'consistency'],
  },
  {
    id: 'sd-s-3',
    category: 'system-design',
    difficulty: 'senior',
    question: 'Design a real-time collaborative document editor like Google Docs. How do you handle conflicts?',
    tags: ['real-time', 'crdt', 'websockets', 'consistency'],
  },
  {
    id: 'sd-s-4',
    category: 'system-design',
    difficulty: 'senior',
    question: 'Design the ML infrastructure for a recommendation engine serving a social media platform with 1B users.',
    tags: ['ml-pipeline', 'recommendation', 'feature-store', 'serving'],
  },

  // ─── Behavioral — All Levels ────────────────────────────────────
  {
    id: 'beh-1',
    category: 'behavioral',
    difficulty: 'junior',
    question: 'Tell me about a time you faced a technical challenge you didn\'t know how to solve. How did you approach it?',
    tags: ['problem-solving', 'learning', 'adaptability'],
  },
  {
    id: 'beh-2',
    category: 'behavioral',
    difficulty: 'junior',
    question: 'Describe a project you\'re most proud of. What was your specific contribution?',
    tags: ['ownership', 'impact', 'projects'],
  },
  {
    id: 'beh-3',
    category: 'behavioral',
    difficulty: 'mid',
    question: 'Tell me about a time you disagreed with a technical decision. How did you handle it?',
    tags: ['conflict', 'communication', 'influence'],
  },
  {
    id: 'beh-4',
    category: 'behavioral',
    difficulty: 'mid',
    question: 'Describe a situation where you had to learn a new technology quickly under pressure.',
    tags: ['adaptability', 'learning', 'pressure'],
  },
  {
    id: 'beh-5',
    category: 'behavioral',
    difficulty: 'senior',
    question: 'Tell me about a time you led a project that failed. What did you learn and what would you do differently?',
    tags: ['leadership', 'failure', 'growth'],
  },
  {
    id: 'beh-6',
    category: 'behavioral',
    difficulty: 'senior',
    question: 'How do you balance technical debt against feature delivery? Give a specific example.',
    tags: ['technical-debt', 'tradeoffs', 'leadership'],
  },
  {
    id: 'beh-7',
    category: 'behavioral',
    difficulty: 'mid',
    question: 'Describe your experience mentoring junior engineers. What approach do you take?',
    tags: ['mentoring', 'leadership', 'communication'],
  },
  {
    id: 'beh-8',
    category: 'behavioral',
    difficulty: 'senior',
    question: 'Tell me about a system you designed from scratch at scale. What were the most important architectural decisions?',
    tags: ['architecture', 'design', 'scale'],
  },
]

export function getQuestions(
  category: QuestionCategory | 'mixed',
  difficulty: Difficulty
): InterviewQuestion[] {
  return QUESTION_BANK.filter(
    (q) =>
      (category === 'mixed' || q.category === category) &&
      q.difficulty === difficulty
  )
}

export function getRandomQuestion(
  category: QuestionCategory | 'mixed',
  difficulty: Difficulty,
  excludeIds: string[] = []
): InterviewQuestion | null {
  const pool = getQuestions(category, difficulty).filter(
    (q) => !excludeIds.includes(q.id)
  )
  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}
