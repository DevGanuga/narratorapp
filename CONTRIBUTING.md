# Contributing to ConvoAI Studio

Thank you for your interest in contributing to ConvoAI Studio! This document provides guidelines for contributing to this proprietary NR8R project.

## 🏢 Important Notice

ConvoAI Studio is a **proprietary tool** developed and owned by **NR8R (Narrator Studio)**. This repository is for internal team use only. All contributions become the property of NR8R.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- Git
- Access to NR8R's internal resources
- Tavus API credentials

### Setup

1. Clone the repository
```bash
git clone [repository-url]
cd narratorapp
```

2. Install dependencies
```bash
npm install
```

3. Configure environment
```bash
cp .env.example .env.local
# Add your Tavus API key and other credentials
```

4. Run development server
```bash
npm run dev
```

---

## 📝 Development Guidelines

### Code Style

- Follow the existing code style and conventions
- Use TypeScript for all new code
- Write clear, descriptive variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Component Structure

```typescript
// Preferred component structure
'use client'; // If needed

import { useState } from 'react';
import type { ComponentProps } from '@/types';

interface Props {
  // Define props
}

export default function ComponentName({ prop }: Props) {
  // Component logic
  return (
    // JSX
  );
}
```

### File Organization

```
app/              # Next.js app directory
├── page.tsx      # Routes
├── layout.tsx    # Layouts
└── components/   # Route-specific components

components/       # Shared components
lib/             # API client and utilities
types/           # TypeScript definitions
docs/            # Documentation
```

---

## 🔄 Git Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `chore/` - Maintenance tasks

Examples:
```
feature/add-conversation-history
fix/video-player-controls
docs/update-api-reference
```

### Commit Messages

Follow the conventional commits format:

```
type(scope): brief description

Detailed explanation (if needed)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

Examples:
```
feat(studio): add conversation recording
fix(api): handle timeout errors correctly
docs(readme): update setup instructions
```

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push to the repository
6. Create a pull request
7. Request review from team members
8. Address feedback
9. Merge after approval

---

## 🧪 Testing

### Running Tests

```bash
npm run test          # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Writing Tests

- Write tests for new features
- Update tests when modifying existing code
- Aim for meaningful test coverage
- Test edge cases and error scenarios

---

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for public functions
- Document complex algorithms
- Explain non-obvious decisions
- Keep inline comments concise

Example:
```typescript
/**
 * Creates a new conversation with the specified replica and persona
 * @param data - Conversation configuration
 * @returns Conversation details including join URL
 * @throws {TavusApiError} If the API request fails
 */
async createConversation(data: CreateConversationRequest): Promise<ConversationResponse> {
  // Implementation
}
```

### Documentation Updates

When adding new features:
1. Update API reference docs
2. Add usage examples
3. Update README if needed
4. Document breaking changes

---

## 🐛 Bug Reports

When reporting bugs, include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots or error messages
- Possible solution (if you have one)

---

## 💡 Feature Requests

For new features, provide:

- Clear use case
- Expected behavior
- Potential implementation approach
- Impact on existing functionality
- Alternative solutions considered

---

## 🔒 Security

### Sensitive Data

- Never commit API keys or credentials
- Use environment variables
- Keep `.env.local` in `.gitignore`
- Don't expose internal URLs or endpoints

### Reporting Security Issues

Report security vulnerabilities to the NR8R development team directly. Do not create public issues for security concerns.

---

## 📖 Resources

### Internal Resources

- [Tavus API Documentation](./docs/tavus-api-reference.md)
- [Usage Examples](./docs/usage-examples.md)
- [Getting Started Guide](./docs/GETTING_STARTED.md)
- [Type Definitions](./types/tavus.ts)

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Tavus Official Docs](https://docs.tavus.io)

---

## ✅ Code Review Checklist

Before submitting a PR, ensure:

- [ ] Code follows project conventions
- [ ] All tests pass
- [ ] No linter errors
- [ ] Documentation updated
- [ ] No hardcoded credentials
- [ ] No console.logs in production code
- [ ] TypeScript types are correct
- [ ] Edge cases handled
- [ ] Error handling implemented
- [ ] Performance considered

---

## 🙏 Recognition

Contributors to ConvoAI Studio are helping build cutting-edge conversational AI technology. Your work directly impacts NR8R's ability to deliver exceptional creative solutions to storytellers worldwide.

---

## 📞 Questions?

For questions or clarifications:
- Ask in team channels
- Reach out to project leads
- Consult internal documentation
- Review existing code patterns

---

**Built with ❤️ by the NR8R team**

© 2025 NR8R (Narrator Studio). All rights reserved.

