# ConvoAI Studio - Deployment Guide

**Version**: 1.0.0  
**Status**: ✅ Production Ready

---

## 🎯 Pre-Deployment Checklist

### Code Quality ✅
- [x] TypeScript compilation successful
- [x] No linter errors
- [x] Build completes successfully
- [x] All routes generate properly
- [x] Custom animations working
- [x] Responsive design verified

### Configuration ✅
- [x] Environment variables documented
- [x] `.env.example` provided
- [x] Sensitive data in `.gitignore`
- [x] Metadata optimized for SEO
- [x] API client configured

### Documentation ✅
- [x] README.md complete
- [x] API reference documentation
- [x] Usage examples
- [x] Contributing guidelines
- [x] Security policy
- [x] License file

### GitHub Setup ✅
- [x] CI/CD pipeline configured
- [x] PR template created
- [x] CODEOWNERS defined
- [x] `.gitignore` properly configured
- [x] Repository documentation

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the best experience for Next.js apps with zero configuration.

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd /Users/Dev/Desktop/narratorapp
vercel

# Production deployment
vercel --prod
```

**Environment Variables to Set in Vercel Dashboard:**
- `TAVUS_API_KEY` - Your Tavus API key
- `NEXT_PUBLIC_APP_NAME` - ConvoAI Studio
- `NEXT_PUBLIC_APP_URL` - Your production URL

### Option 2: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t convoai-studio .
docker run -p 3000:3000 -e TAVUS_API_KEY=your_key convoai-studio
```

### Option 3: Traditional Node Server

```bash
# On your server
git clone [your-repo]
cd narratorapp

# Install dependencies
npm ci --only=production

# Set environment variables
export TAVUS_API_KEY=your_key

# Build
npm run build

# Start with PM2 (recommended)
pm2 start npm --name "convoai-studio" -- start

# Or start directly
npm start
```

---

## 🔧 Environment Configuration

### Development
```env
TAVUS_API_KEY=sk_dev_xxx
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=ConvoAI Studio (Dev)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production
```env
TAVUS_API_KEY=sk_prod_xxx
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=ConvoAI Studio
NEXT_PUBLIC_APP_URL=https://convoai.nr8r.studio
```

---

## 🏗️ Build Configuration

### Current Setup
- **Framework**: Next.js 16.0.3 (App Router)
- **Runtime**: Node.js 18+
- **Build System**: Turbopack
- **Output**: Static + SSR hybrid

### Build Commands
```bash
npm run build     # Create production build
npm start         # Start production server
npm run dev       # Development mode
npm run lint      # Code quality check
```

### Build Output
```
Route (app)
┌ ○ /              (Landing page)
├ ○ /_not-found    (404 page)
└ ○ /studio        (Conversation interface)
```

---

## 🔒 Security Checklist

### Before Going Live
- [ ] Rotate API keys for production
- [ ] Set up CORS policies if needed
- [ ] Configure rate limiting
- [ ] Enable HTTPS only
- [ ] Set up monitoring/logging
- [ ] Configure backup procedures
- [ ] Review access controls
- [ ] Test error scenarios

### Production Environment
- [ ] Use production API keys
- [ ] Enable security headers
- [ ] Set up SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Enable DDoS protection
- [ ] Set up uptime monitoring
- [ ] Configure logging service
- [ ] Backup environment variables

---

## 📊 Monitoring & Maintenance

### Recommended Tools
- **Uptime**: Vercel Analytics, UptimeRobot
- **Errors**: Sentry, LogRocket
- **Performance**: Vercel Speed Insights, Lighthouse
- **Analytics**: Google Analytics, Plausible

### Health Checks
```bash
# Check if build is healthy
npm run build

# Check types
npx tsc --noEmit

# Check linting
npm run lint
```

---

## 🎯 Post-Deployment Tasks

### Immediately After Deploy
- [ ] Verify all routes load correctly
- [ ] Test responsive design on mobile
- [ ] Check console for errors
- [ ] Verify environment variables
- [ ] Test API connectivity
- [ ] Check SSL certificate
- [ ] Verify custom domain (if applicable)

### Within 24 Hours
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Review user feedback
- [ ] Test all interactive elements
- [ ] Verify webhook endpoints (if configured)

### Ongoing
- [ ] Weekly dependency updates
- [ ] Monthly security audits
- [ ] Regular performance reviews
- [ ] Documentation updates as needed

---

## 📱 Domain Configuration

### Recommended Domains
- `convoai.nr8r.studio` - Primary subdomain
- `studio.narrator.io` - Alternative
- Custom branded domain as needed

### DNS Configuration (Vercel)
```
Type: CNAME
Name: convoai (or studio)
Value: cname.vercel-dns.com
```

---

## 🔄 Continuous Integration

### GitHub Actions (Already Configured)
- ✅ Lint on push/PR
- ✅ Type check on push/PR
- ✅ Build verification on push/PR
- ✅ Runs on `main` and `develop` branches

### Required GitHub Secrets
```
TAVUS_API_KEY - Your Tavus API key (for build tests)
```

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Type Errors
```bash
# Regenerate type files
npx tsc --noEmit
```

### Deployment Issues
- Check environment variables are set
- Verify Node.js version (18+)
- Ensure all dependencies installed
- Check logs for specific errors

---

## 📞 Support

For deployment issues or questions:
- **Internal Team**: Use Slack #convoai-studio channel
- **DevOps**: Contact infrastructure team
- **API Issues**: Check Tavus status page

---

## ✅ Final Verification

Before marking deployment complete:

```bash
# Local verification
npm run build && npm start

# Test landing page
curl http://localhost:3000

# Test studio page
curl http://localhost:3000/studio

# Check for console errors (open browser devtools)
# Verify all animations work
# Test responsive breakpoints
# Verify all links function
```

---

**Deployment Approved**: ✅  
**Production Ready**: ✅  
**Team Ready**: ✅

---

**Built by NR8R with enterprise-grade standards** 🎬

© 2025 NR8R (Narrator Studio). All rights reserved.

