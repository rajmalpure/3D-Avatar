# 🚀 Quick Start Guide

## Prerequisites Check

Before you begin, ensure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ npm, yarn, or pnpm package manager
- ✅ Modern web browser (Chrome, Edge, or Safari)

## Step-by-Step Setup

### 1️⃣ Install Dependencies

```bash
npm install
```

**Expected time:** 1-2 minutes

### 2️⃣ Get an Avatar Model

You need a 3D avatar GLB file. Choose one option:

#### Option A: Ready Player Me (Fastest - 2 minutes)
1. Visit https://readyplayer.me/
2. Create an avatar
3. Download as GLB
4. Save to `public/avatar-default.glb`

#### Option B: Download Sample Avatar
```bash
# Download a sample avatar (requires curl)
# Replace [URL] with actual model URL from Sketchfab or similar
curl -o public/avatar-default.glb "[MODEL_URL]"
```

#### Option C: Skip for Now
The app will run but show an empty scene. Add the avatar later.

### 3️⃣ Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 4️⃣ Enable Microphone

When prompted:
1. Click **"Allow"** for microphone access
2. This enables voice interaction features

### 5️⃣ Test the App

1. **Click the pink mic button** → Speak → See transcript
2. **Type in chat** → Send → Get response
3. **Click Settings** → Adjust voice & speed

## 🎉 You're Ready!

The avatar should now:
- ✅ Respond to your voice
- ✅ Display chat messages
- ✅ Animate lip movements
- ✅ Track your mouse with eyes

## Next Steps

### Enable OpenAI (Optional)

For advanced AI responses:

1. Get API key from https://platform.openai.com/api-keys
2. Copy `.env.example` to `.env`
3. Add your key:
   ```env
   VITE_OPENAI_API_KEY=sk-your-key-here
   VITE_LLM_PROVIDER=openai
   ```
4. Restart dev server

### Customize Settings

In the Settings panel (⚙️):
- Change voice and speed
- Switch between providers
- Adjust volume

### Build for Production

```bash
npm run build
npm run preview
```

## Troubleshooting

### "Module not found" errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Avatar not visible
- Check `public/avatar-default.glb` exists
- See `AVATAR_SETUP.md` for model requirements

### Microphone not working
- Use Chrome, Edge, or Safari
- Ensure HTTPS (localhost is OK)
- Check browser permissions

### Port already in use
```bash
# Use different port
npm run dev -- --port 3001
```

## Getting Help

- 📖 Read [README.md](README.md) for full documentation
- 🎭 See [AVATAR_SETUP.md](AVATAR_SETUP.md) for model help
- 🐛 Check browser console for errors

---

**Estimated setup time: 5-10 minutes**

Happy building! 🎉
