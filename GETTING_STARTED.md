# 🎬 GETTING STARTED - Run This Project Now!

## ⚡ TL;DR - Get Running in 3 Commands

```bash
npm install
# Place a GLB avatar file in public/avatar-default.glb (see AVATAR_SETUP.md)
npm run dev
```

Open http://localhost:3000 and click the pink mic button! 🎤

---

## 📋 Step-by-Step Instructions

### Step 1: Verify Prerequisites ✅

Check you have Node.js installed:
```bash
node --version
```
Should show `v18.0.0` or higher. If not, install from [nodejs.org](https://nodejs.org/)

### Step 2: Install Dependencies 📦

```bash
npm install
```

This will install:
- React & React DOM
- Three.js & React Three Fiber
- Zustand (state management)
- TypeScript
- Vite
- And all other dependencies

**Expected time:** 1-2 minutes

### Step 3: Add a 3D Avatar Model 🎭

The app needs a 3D avatar GLB file. You have options:

#### Option A: Quick Test (Skip Avatar)
You can run without an avatar to test other features. The 3D scene will be empty but voice/chat works.

#### Option B: Ready Player Me (2 minutes)
1. Visit https://readyplayer.me/
2. Create a free avatar
3. Download as GLB
4. Save to `public/avatar-default.glb`

#### Option C: Download Sample
```bash
# You'll need to find a free GLB model online
# See AVATAR_SETUP.md for links to free resources
```

**See [`AVATAR_SETUP.md`](AVATAR_SETUP.md) for detailed instructions!**

### Step 4: Start Development Server 🚀

```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Step 5: Open in Browser 🌐

Visit http://localhost:3000

You should see:
- Header with "3D AI Avatar Assistant"
- 3D scene (with avatar if you added one)
- Chat panel on the right
- Pink microphone button at bottom

### Step 6: Test Features ✨

#### Test Voice Input:
1. Click the **pink microphone button** 🎤
2. Click "Allow" when browser asks for mic permission
3. Say something like "Hello, how are you?"
4. Watch it transcribe your speech
5. See the avatar respond!

#### Test Text Chat:
1. Type a message in the chat box
2. Press Enter or click "Send"
3. See the conversation
4. Avatar will speak the response

#### Test Settings:
1. Click ⚙️ Settings (top-right)
2. Adjust speech speed
3. Change volume
4. Try different voices

---

## 🎯 What Each Feature Does

### 🎤 Voice Input (Speech-to-Text)
- Click mic button
- Speak clearly
- Automatic transcription
- Sends to chat

### 🔊 Voice Output (Text-to-Speech)
- Avatar speaks responses
- Realistic lip sync
- Adjustable speed/volume
- Multiple voices

### 💬 Chat Interface
- Full conversation history
- User and assistant messages
- Timestamps
- Clear history button

### 🎭 3D Avatar
- Realistic 3D character
- Facial animations
- Eye tracking (follows mouse)
- Idle animations (breathing, blinking)
- Lip sync with speech

### ⚙️ Settings
- TTS provider (Web Speech or OpenAI)
- Voice selection
- Speech speed (0.5x - 2x)
- Volume control
- LLM provider (Local or OpenAI)

---

## 🔧 Optional: Configure OpenAI

By default, the app uses:
- **Browser speech recognition** (free, offline)
- **Browser text-to-speech** (free, offline)
- **Local pattern-matching responses** (free, offline)

For better AI responses, you can enable OpenAI:

### Step 1: Get API Key
1. Visit https://platform.openai.com/api-keys
2. Create account (if needed)
3. Generate new API key
4. Copy the key (starts with `sk-`)

### Step 2: Configure Environment
```bash
# Copy template
cp .env.example .env

# Edit .env and add:
VITE_OPENAI_API_KEY=sk-your-actual-key-here
VITE_LLM_PROVIDER=openai
VITE_TTS_PROVIDER=openai  # Optional, for better voice
```

### Step 3: Restart Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 4: Test
- Send a message
- Should get GPT-powered responses
- Better conversation quality

**Note:** OpenAI API usage costs money. Check pricing: https://openai.com/pricing

---

## 🧪 Run Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run specific test file
npm test visemeMapping
```

Tests verify:
- ✅ Viseme mapping correctness
- ✅ Audio amplitude calculations
- ✅ TTS provider functionality
- ✅ LLM provider responses
- ✅ Smoothing algorithms

---

## 📦 Build for Production

```bash
# Create production build
npm run build

# Output will be in dist/ folder
```

Preview production build locally:
```bash
npm run preview
```

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for deploying to Vercel, Netlify, etc.

---

## 🐛 Common Issues & Solutions

### Issue: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Issue: "Port 3000 already in use"
**Solution:** 
```bash
# Use different port
npm run dev -- --port 3001
```

### Issue: Microphone not working
**Solutions:**
- Click "Allow" when prompted
- Check browser settings (chrome://settings/content/microphone)
- Use Chrome, Edge, or Safari (best support)
- Ensure you're on localhost or HTTPS

### Issue: Avatar not visible
**Solutions:**
- Check `public/avatar-default.glb` exists
- Verify it's a valid GLB file
- Check browser console for errors
- Try a different GLB model

### Issue: No sound from avatar
**Solutions:**
- Check system volume
- Check browser isn't muted
- Click settings, adjust TTS volume
- Try test: `speechSynthesis.speak(new SpeechSynthesisUtterance('test'))`

### Issue: Build errors
**Solutions:**
```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json .vite
npm install
npm run build
```

### Issue: TypeScript errors
**Solutions:**
- These are compile-time warnings
- App will still run in dev mode
- Fix by installing dependencies: `npm install`

---

## 📚 Next Steps

### Learn the Code
1. Open `src/App.tsx` - Main component
2. Check `src/components/` - UI components
3. Explore `src/lib/` - Core functionality
4. Read `src/state/useStore.ts` - State management

### Customize
1. Change colors in `src/index.css`
2. Modify avatar animations in `AvatarModel.tsx`
3. Add custom responses in `localLLM.ts`
4. Create new facial expressions

### Deploy
1. Follow [`DEPLOYMENT.md`](DEPLOYMENT.md)
2. Choose platform (Vercel recommended)
3. Deploy with one command
4. Share your creation!

---

## 📖 Documentation Map

| File | Purpose | Read When |
|------|---------|-----------|
| **WELCOME.md** | Overview & links | Just downloaded |
| **QUICKSTART.md** | 5-min setup | Want to start fast |
| **README.md** | Full docs | Need complete info |
| **AVATAR_SETUP.md** | 3D model guide | Adding avatars |
| **DEPLOYMENT.md** | Deploy guide | Ready to publish |
| **PROJECT_SUMMARY.md** | What was built | Want to understand |
| **GETTING_STARTED.md** | This file! | First-time setup |

---

## ✅ Checklist

Before you're done, verify:

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Avatar GLB file added (optional but recommended)
- [ ] Dev server running (`npm run dev`)
- [ ] App opens in browser
- [ ] Microphone permission granted
- [ ] Voice input works
- [ ] Chat works
- [ ] Settings panel opens
- [ ] Tests pass (`npm test`)

---

## 🎉 You're All Set!

You now have a fully functional 3D AI Avatar Assistant running locally!

### What You Can Do:
- ✅ Talk to the avatar
- ✅ Chat via text
- ✅ Watch lip sync
- ✅ Customize settings
- ✅ Run tests
- ✅ Deploy to production

### What's Next:
- 🚀 Deploy to the web
- 🎨 Customize the design
- 🤖 Add more features
- 📱 Make it your own!

---

## 🆘 Need Help?

1. **Check Documentation**
   - README.md has troubleshooting section
   - AVATAR_SETUP.md for model issues
   - DEPLOYMENT.md for deploy issues

2. **Browser Console**
   - Press F12 to open DevTools
   - Check Console tab for errors
   - Network tab for loading issues

3. **Common Commands**
   ```bash
   npm install        # Install dependencies
   npm run dev        # Start dev server
   npm test           # Run tests
   npm run build      # Build production
   npm run preview    # Preview build
   ```

4. **Still Stuck?**
   - Read error messages carefully
   - Search for error online
   - Check GitHub issues
   - Open new issue with details

---

## 💪 You Got This!

This is a complete, production-ready application. Everything works. Just follow the steps above and you'll have it running in minutes!

**Happy coding! 🚀**

---

*Quick Reference:*
- 📚 Full docs → README.md
- ⚡ Fast setup → QUICKSTART.md
- 🎭 Add avatar → AVATAR_SETUP.md
- 🌐 Deploy → DEPLOYMENT.md
