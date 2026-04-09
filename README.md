# 🤖 3D AI Avatar Assistant

A production-ready, interactive 3D AI avatar web application with voice interaction, lip-sync animation, and real-time chat capabilities.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- **🎭 3D Avatar Rendering** - Realistic 3D avatar with facial animations using Three.js
- **🎤 Speech Recognition** - Real-time voice input using Web Speech API
- **🔊 Text-to-Speech** - Natural voice responses with lip-sync animation
- **💬 Chat Interface** - Full conversation history with modern UI
- **🔄 Lip Sync** - Audio-driven mouth movements and viseme mapping
- **👁️ Eye Tracking** - Avatar follows mouse cursor with smooth eye movement
- **😊 Facial Expressions** - Dynamic expressions (neutral, happy, thinking, speaking)
- **⚙️ Settings Panel** - Customize voice, speed, provider settings
- **🎨 Dark Neon Theme** - Beautiful cyberpunk-inspired UI
- **🔌 Pluggable Providers** - Switch between local/cloud TTS and LLM services
- **📱 Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Three.js** - 3D graphics rendering
- **React Three Fiber** - React renderer for Three.js
- **Zustand** - Lightweight state management
- **Web Speech API** - Browser-native speech recognition and synthesis
- **Vitest** - Fast unit testing framework

## 📋 Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- - Modern browser with:
  - WebGL support (for 3D rendering)
  - Web Speech API support (Chrome, Edge, Safari recommended)
  - Microphone access (for voice input)

## Live demo

-[3D-Avatar](https://3-d-avatar-rose.vercel.app/)

## 🚀 Quick Start

### 1. Installation

```bash
# Install dependencies
npm install
```

### 2. Environment Setup (Optional)

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Edit `.env` to add API keys if using cloud providers:

```env
# For OpenAI TTS (optional)
VITE_TTS_PROVIDER=webspeech
VITE_OPENAI_API_KEY=your_openai_api_key_here

# For OpenAI LLM (optional)
VITE_LLM_PROVIDER=local
VITE_OPENAI_LLM_MODEL=gpt-3.5-turbo
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Enable Microphone

When prompted, **allow microphone access** for voice interaction features.

## 🎮 Usage

### Voice Interaction

1. Click the **pink microphone button** at the bottom center
2. Speak your message
3. The avatar will respond with voice and lip-sync animation

### Text Chat

1. Type your message in the chat input
2. Press **Send** or hit **Enter**
3. View conversation history in the chat panel

### Settings

1. Click the **Settings** button in the top-right
2. Adjust:
   - TTS Provider (Web Speech or OpenAI)
   - Voice selection
   - Speech speed and volume
   - LLM Provider (Local or OpenAI)

## 📁 Project Structure

```
3D Avatar/
├── public/
│   └── avatar-default.glb          # 3D avatar model
├── src/
│   ├── components/
│   │   ├── AvatarScene.tsx         # 3D scene setup
│   │   ├── AvatarModel.tsx         # Avatar mesh & animations
│   │   ├── ChatPanel.tsx           # Chat interface
│   │   ├── MicButton.tsx           # Voice input button
│   │   └── SettingsPanel.tsx       # Configuration UI
│   ├── lib/
│   │   ├── avatar/
│   │   │   ├── avatarUtils.ts      # 3D utilities
│   │   │   ├── visemeMapping.ts    # Lip-sync logic
│   │   │   └── useLipSync.ts       # Lip-sync hook
│   │   ├── tts/
│   │   │   ├── types.ts            # TTS interfaces
│   │   │   ├── webSpeechTTS.ts     # Web Speech TTS
│   │   │   ├── openaiTTS.ts        # OpenAI TTS
│   │   │   └── providerAdapter.ts  # TTS factory
│   │   ├── stt/
│   │   │   ├── types.ts            # STT interfaces
│   │   │   └── webSpeechSTT.ts     # Web Speech STT
│   │   └── llm/
│   │       ├── types.ts            # LLM interfaces
│   │       ├── localLLM.ts         # Offline responses
│   │       ├── openaiLLM.ts        # OpenAI ChatGPT
│   │       └── providerAdapter.ts  # LLM factory
│   ├── state/
│   │   └── useStore.ts             # Zustand state
│   ├── tests/
│   │   ├── visemeMapping.test.ts   # Lip-sync tests
│   │   ├── providers.test.ts       # Provider tests
│   │   └── setup.ts                # Test setup
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # Entry point
│   ├── index.css                   # Global styles
│   └── vite-env.d.ts               # Vite types
├── .env.example                     # Environment template
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
└── README.md
```

## 🧪 Testing

Run unit tests:

```bash
npm test
```

Run tests with UI:

```bash
npm run test:ui
```

## 🎨 Avatar Models

### Using Default Avatar

The app looks for `/public/avatar-default.glb` by default.

### Adding Custom Avatars

1. **Get a GLB Model** with facial blend shapes:
   - [Ready Player Me](https://readyplayer.me/) - Create custom avatars
   - [Mixamo](https://www.mixamo.com/) - Rigged 3D characters
   - [Sketchfab](https://sketchfab.com/) - Download GLB models

2. **Requirements**:
   - GLB format (not GLTF with separate files)
   - Facial morph targets/blend shapes for lip-sync
   - Reasonable polygon count (< 100k triangles)

3. **Add to Project**:
   ```bash
   # Place in public folder
   public/
   ├── avatar-default.glb
   └── avatar-custom.glb
   ```

4. **Update Settings** (in `SettingsPanel.tsx`):
   ```tsx
   <option value="custom">Custom Avatar</option>
   ```

### Download Script

```bash
# Example: Download from Ready Player Me
curl -o public/avatar-default.glb "https://models.readyplayer.me/[YOUR_AVATAR_ID].glb"
```

## 🔧 Provider Configuration

### TTS Providers

#### Web Speech (Default)
- ✅ Free, built into browser
- ✅ Works offline
- ❌ Limited voice options
- ❌ Variable quality

#### OpenAI TTS
- ✅ High-quality voices
- ✅ Multiple voice options
- ❌ Requires API key & internet
- ❌ Costs per character

**Setup:**
```env
VITE_TTS_PROVIDER=openai
VITE_OPENAI_API_KEY=sk-...
VITE_OPENAI_TTS_MODEL=tts-1
VITE_OPENAI_TTS_VOICE=alloy
```

### LLM Providers

#### Local (Default)
- ✅ Free, works offline
- ✅ No API keys needed
- ❌ Basic pattern-matching responses
- ❌ Limited conversational ability

#### OpenAI GPT
- ✅ Advanced AI conversations
- ✅ Context-aware responses
- ❌ Requires API key & internet
- ❌ Costs per token

**Setup:**
```env
VITE_LLM_PROVIDER=openai
VITE_OPENAI_API_KEY=sk-...
VITE_OPENAI_LLM_MODEL=gpt-3.5-turbo
```

## 📦 Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

Output will be in `dist/` folder.

## 🌐 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Add Environment Variables** (if using OpenAI):
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add `VITE_OPENAI_API_KEY` and other vars

4. **Redeploy**:
   ```bash
   vercel --prod
   ```

### Deploy to Netlify

1. **Install Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   ```

2. **Build**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod --dir=dist
   ```

4. **Add Environment Variables**:
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add `VITE_OPENAI_API_KEY` and other vars

### Deploy via GitHub Actions

See deployment workflows in `.github/workflows/` (create this folder):

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                    User Input                    │
│         (Microphone / Text Chat)                │
└────────────────────┬────────────────────────────┘
                     │
          ┌──────────▼──────────┐
          │   Speech-to-Text    │
          │   (Web Speech API)  │
          └──────────┬──────────┘
                     │
          ┌──────────▼──────────┐
          │    LLM Provider     │
          │  (Local / OpenAI)   │
          └──────────┬──────────┘
                     │
          ┌──────────▼──────────┐
          │   Text-to-Speech    │
          │ (Web Speech/OpenAI) │
          └──────────┬──────────┘
                     │
       ┌─────────────┴─────────────┐
       │                           │
┌──────▼───────┐          ┌───────▼────────┐
│  Lip Sync    │          │  Chat Display  │
│  Controller  │          │   (Messages)   │
└──────┬───────┘          └────────────────┘
       │
┌──────▼───────────────────────────────────┐
│         3D Avatar Renderer               │
│  (Three.js + React Three Fiber)          │
│  - Facial Animations                     │
│  - Eye Tracking                          │
│  - Expression Changes                    │
└──────────────────────────────────────────┘
```

## 🎯 Key Components

### State Management (Zustand)
- Chat messages
- Avatar state (speaking, expression, viseme)
- Voice interaction status
- Settings

### Provider Architecture
- **Adapters** for swappable TTS/LLM services
- Environment-based configuration
- Graceful fallbacks

### 3D Avatar System
- GLB model loading
- Morph target animation
- Real-time lip-sync
- Mouse-based eye tracking
- Idle animations (breathing, blinking)

## 🐛 Troubleshooting

### Microphone Not Working

1. **Check browser permissions**:
   - Chrome: `chrome://settings/content/microphone`
   - Edge: `edge://settings/content/microphone`

2. **Use HTTPS**: Speech recognition requires secure context (localhost is OK for dev)

3. **Browser compatibility**: Use Chrome, Edge, or Safari

### Avatar Not Visible

1. **Check console** for GLB loading errors
2. **Ensure WebGL is enabled**: Visit [https://get.webgl.org/](https://get.webgl.org/)
3. **Try different browser** if GPU issues persist

### No Voice Output

1. **Check system volume** and browser audio settings
2. **Test TTS support**: Open console and run:
   ```js
   speechSynthesis.speak(new SpeechSynthesisUtterance('test'))
   ```

### OpenAI API Errors

1. **Verify API key** is correct in `.env`
2. **Check quota**: Visit [OpenAI Usage Dashboard](https://platform.openai.com/usage)
3. **Review CORS**: Vite dev server should proxy correctly

## 🔒 Security Notes

- **Never commit `.env` file** with real API keys
- **Use environment variables** for sensitive data
- **Rotate API keys** regularly
- **Set usage limits** on OpenAI dashboard

## 📈 Performance Tips

1. **Optimize Avatar Model**:
   - Keep triangle count < 50k for better performance
   - Use compressed textures

2. **Audio Buffer**:
   - Adjust `fftSize` in `AudioAnalyzer` for performance/quality trade-off

3. **React Optimization**:
   - Components use proper memoization
   - Zustand prevents unnecessary re-renders

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use in your projects!

## 🙏 Acknowledgments

- Three.js community
- React Three Fiber team
- Web Speech API contributors
- Open source avatar model creators

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/3d-avatar-assistant/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/3d-avatar-assistant/discussions)

## 🚀 Future Improvements

- [ ] Add more avatar models
- [ ] Support for custom LLM providers (Anthropic, Hugging Face)
- [ ] Advanced emotion detection from text
- [ ] Multi-language support
- [ ] Voice cloning integration
- [ ] Screen recording capability
- [ ] Avatar customization UI
- [ ] Gesture animations
- [ ] Background scenes

---

**Built with ❤️ using React, Three.js, and modern web technologies**
#
