#!/usr/bin/env node

/**
 * PatternBase CLI
 * Quick pattern capture from terminal
 * 
 * Usage:
 *   patternbase "Fix TypeScript error" "success" "claude-code"
 *   patternbase --interactive
 *   patternbase --export > patterns.json
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const PATTERNS_FILE = path.join(os.homedir(), '.patternbase', 'patterns.json');

function ensureDir() {
  const dir = path.dirname(PATTERNS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadPatterns() {
  ensureDir();
  if (!fs.existsSync(PATTERNS_FILE)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(PATTERNS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function savePatterns(patterns) {
  ensureDir();
  fs.writeFileSync(PATTERNS_FILE, JSON.stringify(patterns, null, 2));
}

function createPattern(title, outcome, tool, description = '', solution = '') {
  const now = Date.now();
  return {
    id: `pattern-${now}`,
    title,
    description,
    tool: tool || 'claude-code',
    prompt: '',
    solution,
    tags: [],
    outcome: outcome || 'success',
    reuseCount: 0,
    createdAt: now,
    updatedAt: now,
    source: 'local',
  };
}

function exportPatterns() {
  const patterns = loadPatterns();
  console.log(JSON.stringify(patterns, null, 2));
}

function listPatterns() {
  const patterns = loadPatterns();
  if (patterns.length === 0) {
    console.log('No patterns found.');
    return;
  }
  
  console.log(`\n${patterns.length} pattern(s):\n`);
  patterns.slice(-10).forEach((p, i) => {
    const emoji = p.outcome === 'success' ? '✅' : p.outcome === 'partial' ? '⚠️' : '❌';
    console.log(`  ${i + 1}. ${emoji} ${p.title} (${p.tool})`);
  });
  console.log();
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
PatternBase CLI - Quick pattern capture

Usage:
  patternbase "title" [outcome] [tool] [description] [solution]
  patternbase --list, -l          List recent patterns
  patternbase --export, -e        Export all patterns as JSON
  patternbase --help, -h          Show this help

Examples:
  patternbase "Fix React hook error" "success" "claude-code"
  patternbase "Database migration" "partial" "cursor" "Migrated users table" "Used drizzle ORM"
  patternbase --export > backup.json
`);
    return;
  }
  
  if (args[0] === '--list' || args[0] === '-l') {
    listPatterns();
    return;
  }
  
  if (args[0] === '--export' || args[0] === '-e') {
    exportPatterns();
    return;
  }
  
  // Create pattern from args
  const [title, outcome, tool, description, solution] = args;
  
  if (!title) {
    console.error('Error: Title is required');
    process.exit(1);
  }
  
  const pattern = createPattern(title, outcome, tool, description, solution);
  const patterns = loadPatterns();
  patterns.push(pattern);
  savePatterns(patterns);
  
  console.log(`✅ Pattern saved: ${title}`);
}

main();
