# 🤖 PrepMate 3D — AI Interview Coach

A production-ready, interactive **3D AI Interview Coach** designed to conduct rigorous technical interviews for software and AI engineering roles. Built with React, Three.js, and Google Gemini API.


![Version](https://img.shields.io/badge/version-2.0.0-emerald.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-prepmate3d.vercel.app-brightgreen?logo=vercel)](https://prepmate3d.vercel.app)

## 🌐 Live Demo

> **[https://prepmate3d.vercel.app](https://prepmate3d.vercel.app)**

Sign in with Google and start your AI-powered mock interview instantly — no setup required.

## ✨ Overview

PrepMate 3D elevates standard AI interview prep by introducing a tangible 3D interviewer. It uses real-time conversational AI to conduct dynamic interviews based on your specific background and the target company's standard practices. The AI provides real-time scoring, custom follow-ups, and a detailed session breakdown.

## 🚀 Key Features

- **🎭 3D Avatar Interviewer** - Realistic 3D avatar with facial animations and emotional intelligence (happy, thinking, neutral).
- **🧠 GenAI Intelligence** - Powered by Google Gemini 1.5 with structured output mapping to rate your answers dynamically.
- **📄 Contextual Resume Parsing** - Upload your PDF resume natively in the browser (100% private). The AI dynamically adjusts its question bank to interrogate your specific past projects and tech stack.
- **🕸️ Live Job Description Scraping** - Paste any Greenhouse, Lever, or LinkedIn job URL to automatically scrape the requirements. PrepMate 3D evaluates you strictly against that real-world, active job posting.
- **🎤 Real-Time Voice Interaction** - Browser-native Speech-to-Text and Text-to-Speech API integration with perfectly mapped viseme lip-sync.
- **📊 Real-Time Scoring HUD** - A futuristic dashboard displaying live timer, current question count, and a dynamic score ring based on the quality of your answers.
- **📝 Comprehensive Session Summary** - On ending the session, receive an A-F grade, detailed strengths/improvements breakdown, and a per-question performance timeline.
- **🎯 Dynamic Mode Selection** - Choose between DSA, System Design, Behavioral, or Mixed, targeted precisely at companies like DeepMind, OpenAI, Meta, or Google.

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Vanilla CSS
- **3D Graphics:** Three.js, React Three Fiber, WebGL
- **State Management:** Zustand
- **GenAI Orchestration:** Google Gemini SDK (`@google/genai`)
- **Document Processing:** `pdfjs-dist` (Client-side PDF extraction)
- **Web Scraping:** Jina Reader API (`r.jina.ai`) for LLM-friendly Markdown extraction
- **Voice APIs:** Web Speech API (STT & TTS)

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Google Gemini API Key**
- Modern WebGL and Web Speech API enabled browser (Chrome recommended)

## ⚡ Quick Start

### 1. Installation

```bash
git clone https://github.com/rajmalpure/3D-Avatar.git
cd 3D-Avatar
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and add your Gemini Key:

```env
VITE_GEMINI_API_KEY="your_gemini_api_key_here"
VITE_GEMINI_MODEL="gemini-1.5-flash"
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎙️ How to Use the Coach

1. **Configure Interview:** Click the Gear icon. Upload your `.pdf` resume, select your target seniority level (Junior/Mid/Senior), Target Company, and Interview Mode (DSA/System Design/Behavioral).
2. **Start Session:** Click the top *"Start Interview"* button.
3. **Answer Naturally:** Click the microphone button and speak your answers. 
4. **Watch Responses:** The AI will evaluate your vocal answer, generate dynamic score updates to the left HUD, trigger facial expressions, and respond with a tailored follow-up question.
5. **Get Feedback:** Click *"End Session"* to reveal the Session Summary modal containing your total grade and technical feedback.

## ☁️ Deployment

The project is configured for seamless deployment to Vercel. 

```bash
npm i -g vercel
vercel
```
*Don't forget to add your `VITE_GEMINI_API_KEY` to the Vercel project environment variables.*

## 🔒 Privacy & Security

- **Client-Side Parsing:** PDF resumes are parsed entirely within the browser. The extracted text is injected directly into the Gemini prompt payload and is **never** saved to a database or sent to custom backend servers.

---
**Designed and built by Raj Malpure for the modern AI Engineer portfolio.**
