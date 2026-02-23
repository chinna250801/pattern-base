# PatternBase - Complete Usage Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Web Interface](#web-interface)
3. [CLI Tool](#cli-tool)
4. [Pattern Management](#pattern-management)
5. [Search & Filter](#search--filter)
6. [Import/Export](#importexport)
7. [Statistics](#statistics)
8. [Team Workflows](#team-workflows)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Installation

```bash
# Clone or download the repository
git clone https://github.com/yourusername/patternbase.git
cd patternbase

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### First Pattern (30 seconds)

1. Click **"+ New Pattern"** button
2. Fill in the basics:
   - **Title**: "Fix React useEffect warning"
   - **Tool**: Select your AI tool (Claude Code, Cursor, etc.)
   - **Description**: What were you trying to do?
   - **Solution**: What actually worked?
3. Click **"Save Pattern"**
4. Done! Your knowledge is now preserved.

---

## Web Interface

### Navigation Overview

```
┌─────────────────────────────────────────────────────────────┐
│  PatternBase                                    [+ New]     │
├─────────────────────────────────────────────────────────────┤
│  [Search...] [All Tools ▼] [All Outcomes ▼]                 │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Pattern Card │  │ Pattern Card │  │ Pattern Card │      │
│  │              │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Views

| View | Access | Purpose |
|------|--------|---------|
| **List** | Default | Browse all patterns with filters |
| **Create** | "+ New Pattern" | Add new pattern |
| **Edit** | Click "Edit" on card | Modify existing pattern |
| **View** | Click on card | See full pattern details |
| **Stats** | 📊 button | Analytics dashboard |
| **Import** | "Import" button | Import patterns from JSON |

---

## CLI Tool

### Installation

```bash
# Make CLI executable
chmod +x cli/patternbase.js

# Create symlink for global access
ln -s $(pwd)/cli/patternbase.js /usr/local/bin/patternbase

# Or add to your PATH in .bashrc/.zshrc
export PATH="$PATH:/path/to/patternbase/cli"
```

### CLI Commands

#### Quick Capture

```bash
# Basic usage
patternbase "Title of your pattern" "success" "claude-code"

# Full usage with all fields
patternbase "Title" "outcome" "tool" "description" "solution"

# Real example
patternbase "Fix TypeScript generic error" "success" "claude-code" "Getting type instantiation error with useState" "Use explicit type: useState<Type | null>(null)"
```

#### List Patterns

```bash
patternbase --list
# or
patternbase -l

# Output:
# 5 pattern(s):
#
#   1. ✅ Fix TypeScript generic error (claude-code)
#   2. ✅ Vite path alias config (cursor)
#   3. ⚠️ React useEffect cleanup (claude-code)
#   4. ✅ Import JSON in TS (copilot)
#   5. ❌ CSS Grid issue (cursor)
```

#### Export Patterns

```bash
# Export to stdout
patternbase --export

# Export to file
patternbase --export > my-patterns.json

# Export with timestamp
patternbase --export > patterns-$(date +%Y%m%d).json
```

#### Help

```bash
patternbase --help
# or
patternbase -h
```

### CLI Data Location

CLI stores patterns separately from the web app:
- **Location**: `~/.patternbase/patterns.json`
- **Format**: Same JSON structure as web app
- **Migration**: Use export/import to move between CLI and web

---

## Pattern Management

### Creating a Pattern

**Required Fields:**
- ✅ **Title**: Short, searchable name
- ✅ **Description**: What were you trying to accomplish?
- ✅ **Solution**: What actually worked (code, approach, etc.)

**Optional Fields:**
- 📝 **Tool**: Which AI tool you used
- 📝 **Prompt**: What you asked the AI
- 📝 **Tags**: Categories for organization
- 📝 **Outcome**: Success, partial, or failure
- 📝 **Failure Reason**: If it didn't work, why?

### Pattern Schema

```typescript
{
  id: "pattern-1708600000000",        // Auto-generated timestamp
  title: "Descriptive title",
  description: "Context of the problem",
  tool: "claude-code" | "cursor" | "copilot" | "other",
  prompt: "What you asked the AI",
  solution: "The working solution",
  tags: ["typescript", "react"],
  outcome: "success" | "partial" | "failure",
  failureReason: "Why it failed (optional)",
  reuseCount: 3,                       // Auto-tracked
  createdAt: 1708600000000,           // Auto-generated
  updatedAt: 1709100000000,           // Auto-updated
  source: "local" | "team"             // Auto-set on import
}
```

### Best Practices for Patterns

#### Good Title Examples
```
✅ "Fix TypeScript 'excessively deep' error with generics"
✅ "Vite build fails on path aliases - solution"
✅ "React useEffect infinite loop with dependency array"

❌ "TypeScript error"
❌ "Fixed it"
❌ "Help"
```

#### Good Description Examples
```
✅ "When using useState with a complex interface, TypeScript 
    can't infer the type and throws 'excessively deep' error"

✅ "Vite dev server works but production build fails with 
    'Cannot find module @/components' error"
```

#### Good Solution Examples
```
✅ Include actual code:
    const [data, setData] = useState<MyInterface | null>(null);
    
    NOT:
    const [data, setData] = useState(null);

✅ Step-by-step:
    1. Update vite.config.ts with resolve.alias
    2. Add paths to tsconfig.json
    3. Install @types/node
    
✅ Include common mistakes to avoid:
    Common pitfall: Forgetting to add the dependency to 
    the useEffect array causes infinite loops.
```

### Reusing Patterns

When you find a pattern that helps you again:

1. Open the pattern detail view
2. Click **"✓ Used This"** button
3. Reuse count increments automatically
4. Pattern moves to top of list (sorted by recent use)

**Why track reuse?**
- See which patterns are most valuable
- Identify your common problem areas
- Measure your learning over time

---

## Search & Filter

### Search Bar

**Searches across:**
- Title
- Description
- Solution text
- Tags

**Search Tips:**
```
"useState"              → Finds patterns mentioning useState
"typescript generic"    → Finds patterns with both words
"vite build"            → Finds Vite build-related patterns
```

### Tool Filter

Filter by AI tool used:
- 🟢 **Claude Code**
- 🟣 **Cursor**
- 🔵 **GitHub Copilot**
- ⚪ **Other**

### Outcome Filter

Filter by result:
- ✅ **Success** - Fully solved the problem
- ⚠️ **Partial** - Workaround or incomplete solution
- ❌ **Failure** - Document what didn't work

### Tag System

**Built-in Tags:**
```
typescript, react, api, database, testing, 
debugging, refactor, bugfix, feature, documentation
```

**Custom Tags:**
- Type any tag in the "Add tag" field
- Press Enter or click "Add"
- Use client names: `client-acme`, `project-alpha`
- Use tech stack: `nextjs`, `prisma`, `tailwind`

**Tag Best Practices:**
```
✅ Consistent: Always use "typescript" not "TypeScript"
✅ Granular: "react-hooks" instead of just "react"
✅ Project-specific: "client-a", "internal-tool"
✅ Stack-based: "mern", "laravel", "rails"
```

---

## Import/Export

### Exporting Your Patterns

**From Web App:**
1. Click **"Export"** button in header
2. File downloads automatically: `patternbase-backup-2024-01-15.json`

**From CLI:**
```bash
patternbase --export > my-patterns.json
```

### Importing Patterns

**Use Cases:**
- 🤝 **Team sharing**: Import teammates' patterns
- 🔄 **New device**: Move patterns to another computer
- 📦 **Backup restore**: Recover from backup file
- 🌟 **Community**: Import shared pattern libraries

**How to Import:**
1. Click **"Import"** button
2. Paste JSON array of patterns
3. Click **"Import"** button
4. Review success message

**Import Behavior:**
- ✅ Duplicate IDs are skipped (no overwrites)
- ✅ New patterns get `source: "team"` tag
- ✅ Patterns sorted by `updatedAt`

### JSON Format

```json
[
  {
    "id": "pattern-1708600000000",
    "title": "Example Pattern",
    "description": "Problem description",
    "tool": "claude-code",
    "prompt": "What you asked",
    "solution": "What worked",
    "tags": ["typescript", "react"],
    "outcome": "success",
    "reuseCount": 5,
    "createdAt": 1708600000000,
    "updatedAt": 1709100000000,
    "source": "local"
  }
]
```

---

## Statistics

Access via 📊 button in header.

### Dashboard Overview

```
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│   42    │ │   35    │ │   5     │ │   2     │
│  Total  │ │ Success │ │ Partial │ │ Failure │
└─────────┘ └─────────┘ └─────────┘ └─────────┘
```

### Statistics Explained

| Metric | What It Tells You |
|--------|-------------------|
| **Total** | How many patterns you've captured |
| **Success** | Problems fully solved (83% in example) |
| **Partial** | Workarounds or incomplete solutions |
| **Failure** | Documented dead-ends (avoids repeat mistakes) |
| **By Tool** | Which AI tools you use most |
| **Tags** | Your most common problem areas |

### Using Statistics

**Personal Growth:**
- High failure count → Good! You're documenting mistakes
- Low reuse count → Search more before solving
- Tool distribution → Which AI is worth the subscription?

**Team Insights:**
- Most common tags → Training opportunities
- High-reuse patterns → Create templates
- Tool success rates → Standardize on best performers

---

## Team Workflows

### Weekly Pattern Sync

**Every Friday:**

1. **Individual Export:**
   ```bash
   # Each team member
   patternbase --export > alex-patterns.json
   ```

2. **Share in Slack:**
   ```
   #team-patterns channel:
   "This week's patterns from @alex"
   [Attach alex-patterns.json]
   ```

3. **Team Import:**
   - Download teammate's JSON
   - Open PatternBase
   - Click Import
   - Paste JSON

4. **Review Together:**
   - Tag team-relevant patterns with `team`
   - Discuss high-reuse patterns
   - Create team standards from common solutions

### Building Team Knowledge

**Month 1:** Everyone captures individually
**Month 2:** Share patterns weekly
**Month 3:** Identify common patterns → Create templates
**Month 6:** Team pattern library becomes onboarding resource

### Pattern Conventions for Teams

**Tagging Standards:**
```
client- prefix:  client-acme, client-beta
project- prefix: project-refactor, project-migration
stack- prefix:  stack-mern, stack-rails
urgent:         Hotfixes, critical bugs
```

**Title Conventions:**
```
[CLIENT] Description          → [Acme] Fix auth timeout
[PROJECT] Description         → [Migration] Database backup
[STACK] Description           → [MERN] API error handling
```

---

## Best Practices

### The 30-Second Rule

If it took you more than 10 minutes to solve, spend 30 seconds documenting it.

**Quick Capture Workflow:**
```
1. Solve the problem
2. Copy solution to clipboard
3. Open PatternBase (or use CLI)
4. Paste + 2-sentence description
5. Save
```

### Tag Consistently

Create a personal tag convention:
```
technology:  typescript, react, nodejs
type:        bugfix, feature, refactor, debug
category:    api, database, ui, testing
project:     client-a, internal, side-project
```

### Search First, Solve Second

**Before asking AI:**
1. Search PatternBase for similar issues
2. Check if you solved this before
3. Reuse existing pattern if applicable

**After solving:**
1. Capture new pattern
2. Link related patterns in description

### Review Monthly

**Monthly Pattern Review (15 minutes):**
1. Check Statistics
2. Review highest reuse patterns
3. Update outdated solutions
4. Delete patterns no longer relevant
5. Export backup

---

## Troubleshooting

### Data Issues

**Patterns disappeared?**
```
✓ Check if you're in the right browser
✓ Check localStorage isn't cleared
✓ Import from your latest backup
✗ PatternBase doesn't sync across browsers automatically
```

**Import failed?**
```
✓ Check JSON is valid (use jsonlint.com)
✓ Ensure it's an array: [{...}, {...}]
✓ Check for duplicate IDs
✓ Verify required fields: title, description, solution
```

**Export empty?**
```
✓ You have no patterns yet
✓ Create your first pattern
✓ Check Statistics to confirm count
```

### Browser Issues

**localStorage full?**
```
✓ Export patterns as backup
✓ Delete old/irrelevant patterns
✓ Browser limit is ~5MB (thousands of patterns)
```

**Site not loading?**
```
✓ Check console for errors
✓ Clear browser cache
✓ Try incognito mode
✓ Verify build: npm run build
```

### CLI Issues

**Permission denied?**
```bash
chmod +x cli/patternbase.js
```

**Command not found?**
```bash
# Check if in PATH
which patternbase

# Or use full path
./cli/patternbase.js --help
```

**CLI patterns not in web app?**
```
✓ CLI and web use separate storage
✓ Export from CLI: patternbase --export
✓ Import to web app
✓ Or manually copy ~/.patternbase/patterns.json
```

---

## Advanced Tips

### Browser Extension Workflow

**Coming Soon:** Browser extension for one-click capture

**Current Workaround:**
1. Pin PatternBase tab
2. Use global shortcut (if available)
3. Use CLI for terminal-based workflows

### Integrating with Note-Taking

**Export to Notion/Obsidian:**
```bash
# Export patterns
patternbase --export > patterns.json

# Use jq to convert to markdown
jq -r '.[] | "## \(.title)\n\n**Tool:** \(.tool)\n**Outcome:** \(.outcome)\n\n### Problem\n\(.description)\n\n### Solution\n\(.solution)\n\n---"' patterns.json > patterns.md
```

### Bulk Operations

**Delete all patterns:**
```javascript
// Open browser console
localStorage.removeItem('patternbase:patterns')
location.reload()
```

**Merge two pattern files:**
```bash
# Combine exports
jq -s 'add' file1.json file2.json > merged.json
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Focus search (when implemented) |
| `Esc` | Close modal / Go back |
| `Enter` | Submit form |
| `Ctrl/Cmd + Enter` | Save pattern (in form) |

---

## Support

**Common Questions:**

**Q: Where is my data stored?**  
A: In your browser's localStorage. Only you have access.

**Q: Can I sync across devices?**  
A: Not automatically. Use Export/Import to move data.

**Q: Is there a mobile app?**  
A: Not yet, but the web app is responsive and works on mobile.

**Q: Can multiple people edit the same patterns?**  
A: Not simultaneously. Use the weekly sync workflow for teams.

**Q: What if I clear my browser data?**  
A: Your patterns will be lost. Export regularly as backup.

---

## Next Steps

1. ✅ Create your first pattern now
2. ✅ Set up CLI for terminal capture
3. ✅ Schedule weekly exports
4. ✅ Share with your team
5. ✅ Review statistics monthly

**Remember:** PatternBase is only useful if you use it. Capture everything that took you >10 minutes to solve!
