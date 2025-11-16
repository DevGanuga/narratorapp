# ConvoAI Studio

<div align="center">

**A Proprietary Conversational AI Platform**

*Built by [NR8R (Narrator Studio)](https://narrator.studio)*

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](../LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org)

</div>

---

## 🎯 Overview

ConvoAI Studio is NR8R's proprietary platform for creating real-time, human-like multimodal video conversations with AI replicas. Built to empower storytellers and creatives with cutting-edge conversational AI technology.

### ✨ Key Features

- 🎭 **AI Replicas** - Create lifelike digital twins from 2-minute videos
- 🧠 **Smart Personas** - Define custom behaviors, tone, and knowledge
- 💬 **Real-Time Conversations** - Natural video interactions with multimodal AI
- 🎬 **Video Generation** - Create marketing content from scripts or audio
- 📚 **Knowledge Base** - Upload documents for context-aware conversations
- 🛡️ **Safety Controls** - Behavioral boundaries and brand guidelines

---

## 🏢 About NR8R

**Narrator** is an award-winning, artist-focused creative agency, production hub, and post campus partnering with storytellers to create visually compelling marketing materials and immersive campaigns that celebrate stories from all over the world.

### Our Mission

We work shoulder to shoulder with artists, filmmakers, and storytellers to celebrate and share their vision with the world.

### Our Values

As NR8Rs we are driven to continuously improve, innovate, and expand our capabilities. We celebrate unique perspectives and take ownership of our actions with transparency and integrity.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Add your Tavus API key to .env.local

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

For detailed setup instructions, see [Getting Started](../docs/GETTING_STARTED.md).

---

## 📚 Documentation

- 📖 [Complete API Reference](../docs/tavus-api-reference.md)
- 💡 [Usage Examples](../docs/usage-examples.md)
- ⚡ [Quick Reference](../docs/api-quick-reference.md)
- 🎓 [Getting Started Guide](../docs/GETTING_STARTED.md)
- 📝 [Contributing Guidelines](../CONTRIBUTING.md)
- 🔒 [Security Policy](../SECURITY.md)
- 📋 [Changelog](../CHANGELOG.md)

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **API**: Tavus Conversational Video Interface
- **Runtime**: Node.js 18+

---

## 📦 Project Structure

```
convoai-studio/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Landing page
│   ├── studio/            # Studio interface
│   └── layout.tsx         # Root layout
├── lib/                   # API client & utilities
│   ├── tavus-client.ts    # Complete API wrapper
│   ├── tavus-server.ts    # Server actions
│   └── index.ts           # Exports
├── types/                 # TypeScript definitions
│   └── tavus.ts           # 60+ interfaces
├── docs/                  # Documentation
│   ├── tavus-api-reference.md
│   ├── usage-examples.md
│   └── ...
└── components/            # Shared components (future)
```

---

## 🎨 Features Breakdown

### Conversations API
Create, manage, and monitor real-time AI conversations with customizable settings and callbacks.

### Personas API
Define AI behavior, knowledge, and personality traits. Configure LLM settings, TTS engines, and conversational flow.

### Replicas API
Train AI replicas from video footage using phoenix-3 model. Monitor training progress and manage replica library.

### Objectives API
Set conversation goals and outcomes. Define what the AI should achieve during interactions.

### Guardrails API
Establish behavioral boundaries. Ensure conversations stay professional and on-brand.

### Documents API
Upload knowledge base materials (PDF, DOCX, images, websites) for context-aware conversations.

### Video Generation API
Create marketing videos from scripts or audio files with customizable backgrounds and watermarks.

---

## 🔐 Security

This is a **proprietary and confidential** project. See [SECURITY.md](../SECURITY.md) for:

- Security policies
- Vulnerability reporting
- Best practices
- Compliance information

**Never commit:**
- API keys or credentials
- `.env.local` files
- Internal URLs or endpoints
- Customer data

---

## 🤝 Contributing

ConvoAI Studio is an internal NR8R project. For contribution guidelines, see [CONTRIBUTING.md](../CONTRIBUTING.md).

### Quick Checklist

- [ ] Code follows project conventions
- [ ] All tests pass
- [ ] No linter errors
- [ ] Documentation updated
- [ ] No hardcoded credentials

---

## 📊 API Coverage

**35/35 Endpoints Implemented** (100%)

| Category | Endpoints | Status |
|----------|-----------|--------|
| Conversations | 5 | ✅ Complete |
| Personas | 5 | ✅ Complete |
| Replicas | 5 | ✅ Complete |
| Objectives | 5 | ✅ Complete |
| Guardrails | 5 | ✅ Complete |
| Documents | 5 | ✅ Complete |
| Video Generation | 5 | ✅ Complete |

---

## 📈 Roadmap

- [x] Complete API wrapper (35 endpoints)
- [x] TypeScript type definitions
- [x] Landing page & studio interface
- [x] Comprehensive documentation
- [ ] Real-time conversation monitoring
- [ ] Analytics dashboard
- [ ] Advanced UI components
- [ ] Recording & playback
- [ ] Team collaboration features

---

## 📄 License

**Proprietary & Confidential**

© 2025 NR8R (Narrator Studio). All rights reserved.

This software is proprietary to NR8R and is intended for internal use only. Unauthorized copying, distribution, modification, or use of this software is strictly prohibited.

See [LICENSE](../LICENSE) for full details.

---

## 🆘 Support

For questions, issues, or feature requests:

- **Internal Team**: Use designated Slack channels
- **Documentation**: Check `/docs` directory
- **Issues**: Create GitHub issues for tracking

---

## 🙏 Acknowledgments

Built with passion by the NR8R development team to empower storytellers with cutting-edge conversational AI technology.

Special thanks to:
- The Tavus team for their powerful API
- Our creative team for design and UX guidance
- The Next.js community for excellent tooling

---

<div align="center">

**Built with ❤️ by the NR8R team**

[Website](https://narrator.studio) • [Documentation](../docs/) • [Contributing](../CONTRIBUTING.md)

</div>

