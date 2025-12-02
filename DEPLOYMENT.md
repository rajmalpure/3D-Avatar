# 🚀 Deployment Guide

Complete guide for deploying your 3D AI Avatar Assistant to production.

## Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Avatar model added to `public/` folder
- [ ] Tests passing (`npm test`)
- [ ] Production build successful (`npm run build`)
- [ ] Environment variables configured (if using OpenAI)
- [ ] Git repository initialized and pushed

## Option 1: Vercel (Recommended)

### Why Vercel?
- ✅ Fastest deployment
- ✅ Automatic HTTPS
- ✅ Zero config for Vite
- ✅ Built-in CDN
- ✅ Free tier available

### Steps

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Deploy**
```bash
# From project root
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name? 3d-avatar-assistant
# - Directory? ./
# - Override settings? No
```

4. **Production Deploy**
```bash
vercel --prod
```

5. **Add Environment Variables** (if using OpenAI)
```bash
vercel env add VITE_OPENAI_API_KEY
# Paste your key
# Select production environment
```

Or via dashboard:
- Go to https://vercel.com/dashboard
- Select your project
- Settings → Environment Variables
- Add:
  - `VITE_OPENAI_API_KEY`
  - `VITE_TTS_PROVIDER=openai`
  - `VITE_LLM_PROVIDER=openai`

6. **Redeploy with new env vars**
```bash
vercel --prod
```

### Custom Domain
```bash
vercel domains add yourdomain.com
# Follow DNS instructions
```

---

## Option 2: Netlify

### Why Netlify?
- ✅ Great for static sites
- ✅ Form handling
- ✅ Split testing
- ✅ Free tier with generous limits

### Steps

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login**
```bash
netlify login
```

3. **Build**
```bash
npm run build
```

4. **Deploy**
```bash
netlify deploy

# Follow prompts:
# - Create new site? Yes
# - Team? (your team)
# - Site name? 3d-avatar-assistant
# - Publish directory? dist
```

5. **Production Deploy**
```bash
netlify deploy --prod
```

6. **Add Environment Variables**

Via CLI:
```bash
netlify env:set VITE_OPENAI_API_KEY "sk-your-key"
```

Or via dashboard:
- Go to https://app.netlify.com/
- Select your site
- Site settings → Environment variables
- Add variables

7. **Trigger Rebuild**
```bash
netlify build
```

### Custom Domain
- Dashboard → Domain settings → Add custom domain
- Follow DNS setup instructions

---

## Option 3: GitHub Pages

### Why GitHub Pages?
- ✅ Free hosting
- ✅ Built into GitHub
- ❌ Limited to static sites only
- ❌ No server-side env vars

### Steps

1. **Update `vite.config.ts`**
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/3d-avatar-assistant/', // Your repo name
  // ... rest of config
})
```

2. **Install gh-pages**
```bash
npm install -D gh-pages
```

3. **Add deploy script to `package.json`**
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

4. **Deploy**
```bash
npm run deploy
```

5. **Enable GitHub Pages**
- Go to repository → Settings → Pages
- Source: gh-pages branch
- Save

6. **Access site**
```
https://yourusername.github.io/3d-avatar-assistant/
```

**Note:** API keys must be embedded in build (not recommended for security)

---

## Option 4: Docker Container

### Why Docker?
- ✅ Deploy anywhere
- ✅ Consistent environment
- ✅ Self-hosted option

### Dockerfile

Create `Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

Create `nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Build & Run

```bash
# Build image
docker build -t 3d-avatar-assistant .

# Run container
docker run -p 8080:80 3d-avatar-assistant

# Access at http://localhost:8080
```

### Deploy to Cloud

**AWS ECS:**
```bash
aws ecr create-repository --repository-name 3d-avatar-assistant
docker tag 3d-avatar-assistant:latest [ECR-URL]
docker push [ECR-URL]
# Create ECS service with the image
```

**Google Cloud Run:**
```bash
gcloud builds submit --tag gcr.io/[PROJECT-ID]/3d-avatar-assistant
gcloud run deploy --image gcr.io/[PROJECT-ID]/3d-avatar-assistant --platform managed
```

---

## Performance Optimization

### Before Deployment

1. **Optimize Assets**
```bash
# Compress images
npm install -D imagemin-cli
npx imagemin public/*.{jpg,png} --out-dir=public/optimized

# Compress GLB models
npm install -g gltf-pipeline
gltf-pipeline -i public/avatar.glb -o public/avatar-optimized.glb -d
```

2. **Enable Compression**

Vercel/Netlify enable this automatically.

For custom servers, add to `vite.config.ts`:
```typescript
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
})
```

3. **Lazy Load Models**
```typescript
// In AvatarModel.tsx
const { scene } = useGLTF('/avatar-default.glb', true) // Enable Draco compression
```

### After Deployment

1. **Enable CDN** (Vercel/Netlify have this built-in)

2. **Monitor Performance**
- Lighthouse audit
- Core Web Vitals
- Bundle size analysis

3. **Set Cache Headers**

For Vercel, create `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

For Netlify, create `netlify.toml`:
```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## Security Best Practices

1. **Never commit API keys**
```bash
# Add to .gitignore
.env
.env.local
.env.production
```

2. **Use environment variables**
- Set in hosting platform dashboard
- Never hardcode in source

3. **Rate limiting** (for API calls)
```typescript
// Implement rate limiting for OpenAI calls
let lastCallTime = 0
const MIN_INTERVAL = 1000 // 1 second

async function rateLimitedChat(message: string) {
  const now = Date.now()
  const timeSinceLastCall = now - lastCallTime
  if (timeSinceLastCall < MIN_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_INTERVAL - timeSinceLastCall))
  }
  lastCallTime = Date.now()
  return llm.chat(message)
}
```

4. **Content Security Policy**

Add to `index.html`:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.openai.com;
">
```

---

## Monitoring & Analytics

### Add Analytics

1. **Google Analytics**
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

2. **Vercel Analytics**
```bash
npm install @vercel/analytics
```

```typescript
// In main.tsx
import { Analytics } from '@vercel/analytics/react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <Analytics />
  </>
)
```

### Error Tracking

Consider integrating:
- [Sentry](https://sentry.io/) for error tracking
- [LogRocket](https://logrocket.com/) for session replay

---

## Troubleshooting Deployment

### Build Fails

**Error: "Module not found"**
```bash
# Clear cache
rm -rf node_modules .vite
npm install
npm run build
```

**Error: "Out of memory"**
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### Runtime Errors

**"Failed to fetch model"**
- Ensure GLB file is in `public/` folder
- Check file size (< 10MB recommended)
- Verify path in code matches actual file name

**"Speech recognition not supported"**
- Ensure site is served over HTTPS
- Use supported browser (Chrome, Edge, Safari)

### Performance Issues

**Slow initial load**
- Enable compression (gzip/brotli)
- Optimize GLB model size
- Use CDN for assets

**Laggy animations**
- Reduce polygon count in avatar model
- Lower `fftSize` in AudioAnalyzer
- Disable shadows in production if needed

---

## Post-Deployment Checklist

- [ ] Site accessible at production URL
- [ ] Avatar model loads correctly
- [ ] Voice input works (mic permission)
- [ ] Chat interface functional
- [ ] Settings panel opens and saves
- [ ] TTS plays audio
- [ ] Lip sync animations work
- [ ] Mobile responsive design works
- [ ] HTTPS enabled
- [ ] Analytics tracking (if added)
- [ ] Error monitoring setup (if added)

---

## Estimated Deployment Times

| Platform | Setup | Deploy | Total |
|----------|-------|--------|-------|
| Vercel   | 5 min | 2 min  | 7 min |
| Netlify  | 5 min | 3 min  | 8 min |
| GitHub Pages | 10 min | 5 min | 15 min |
| Docker   | 15 min | 10 min | 25 min |

---

**You're now ready to deploy! 🚀**

Choose the platform that best fits your needs and follow the steps above.
