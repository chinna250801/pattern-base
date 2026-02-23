# PatternBase

> A **static, GitHub Pages-ready** tool for capturing and remembering successful AI agent interactions.

---

## What It Does

PatternBase solves the **agent memory gap**: AI agents start fresh every session, forgetting what worked before.

| Without PatternBase | With PatternBase |
|---------------------|------------------|
| Agent makes same mistake repeatedly | Agent remembers successful patterns |
| Solutions lost across sessions | Solutions captured and reused |
| No team knowledge sharing | Patterns exportable/importable |

---

## Features

- **Pattern Capture**: Log task, prompt, solution, and outcome
- **Smart Search**: Find patterns by keyword, tool, outcome, or tags
- **Statistics Dashboard**: Track success rates by tool and category
- **Team Sharing**: Export/import JSON for team collaboration
- **CLI Tool**: Quick capture from terminal
- **Dark Mode**: Easy on the eyes during long coding sessions
- **Zero Backend**: Runs entirely in browser (localStorage)

---

## Quick Start

### 1. Deploy to GitHub Pages (Free)

```bash
# Fork this repo
git clone https://github.com/chinna250801/pattern-base.git
cd patternbase

# Install dependencies
npm install

# Build for production
npm run build

# Deploy to GitHub Pages
git add dist -f
git commit -m "Deploy"
git subtree push --prefix dist origin gh-pages
```

### 2. Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## Usage

### Web Interface

1. Click **"+ New Pattern"** to capture a successful interaction
2. Fill in: title, tool used, description, prompt, solution
3. Tag it for easy discovery
4. View patterns in grid or detailed view
5. Click **"✓ Used This"** when you reuse a pattern

### CLI Tool

```bash
# Add CLI to your path
chmod +x cli/patternbase.js
ln -s $(pwd)/cli/patternbase.js /usr/local/bin/patternbase

# Quick capture
patternbase "Fix TypeScript generic error" "success" "claude-code"

# List recent patterns
patternbase --list

# Export for team sharing
patternbase --export > team-patterns.json
```

---

## Data Structure

Patterns are stored as JSON with this schema:

```json
{
  "id": "pattern-1234567890",
  "title": "Fix React useEffect dependency warning",
  "description": "React complaining about missing dependencies in useEffect",
  "tool": "claude-code",
  "prompt": "How do I fix the React useEffect dependency warning?",
  "solution": "Add the missing dependencies to the dependency array or use eslint-disable-next-line react-hooks/exhaustive-deps",
  "tags": ["react", "hooks", "debugging"],
  "outcome": "success",
  "reuseCount": 3,
  "createdAt": 1700000000000,
  "updatedAt": 1700000000000,
  "source": "local"
}
```

---

## Team Workflow

1. **Individual Capture**: Each developer captures patterns during their work
2. **Weekly Export**: Export patterns as JSON
3. **Team Sync**: Share via Slack/GitHub/Email
4. **Import**: Team members import shared patterns
5. **Iterate**: Build team knowledge base over time

---

## Architecture

```
patternbase/
├── src/
│   ├── types.ts              # TypeScript interfaces
│   ├── storage.ts            # localStorage CRUD
│   ├── components/
│   │   ├── PatternCard.tsx   # Grid item component
│   │   ├── PatternForm.tsx   # Create/edit form
│   │   └── PatternView.tsx   # Detail view
│   ├── App.tsx               # Main app
│   └── App.css               # Dark theme styles
├── cli/
│   └── patternbase.js        # Terminal capture tool
├── dist/                     # Static build output
├── vite.config.ts            # Vite + static export config
└── package.json
```

**Stack:**
- React + TypeScript
- Vite (build + dev server)
- localStorage (persistence)
- GitHub Pages (hosting)

---

## Why PatternBase?

**Not another agent framework.** PatternBase is a **learning layer** that sits alongside your existing tools:

- Works with Claude Code, Cursor, Copilot, or any AI tool
- No integration required—just log what works
- Portable data (JSON export)
- Private by default (localStorage, no cloud)
- Free forever (GitHub Pages hosting)

---

## Roadmap

- [ ] Browser extension for one-click capture
- [ ] Pattern similarity matching
- [ ] Team sync via GitHub Gist
- [ ] Success rate analytics
- [ ] Pattern templates

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT — Free for personal and commercial use.

---

## Credits

Built following research from:
- Boris Cherny (Anthropic) — Parallel agent workflows
- Eugene Yan — Evaluation frameworks
- Simon Willison — Vibe engineering principles
