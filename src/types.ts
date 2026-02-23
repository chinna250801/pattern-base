/**
 * Pattern Schema - First Principles Design
 * 
 * A pattern represents a successful (or failed) agent interaction
 * that can be remembered and reused across sessions.
 */

export type Outcome = 'success' | 'partial' | 'failure';
export type Tool = 'claude-code' | 'cursor' | 'copilot' | 'other';

export interface Pattern {
  /** Unique identifier (timestamp-based) */
  id: string;
  
  /** Short, searchable title */
  title: string;
  
  /** Detailed description of the task */
  description: string;
  
  /** The AI tool used */
  tool: Tool;
  
  /** The actual prompt or approach used */
  prompt: string;
  
  /** The solution or result */
  solution: string;
  
  /** Tags for categorization */
  tags: string[];
  
  /** Success outcome */
  outcome: Outcome;
  
  /** Optional: what went wrong if failed */
  failureReason?: string;
  
  /** Number of times this pattern was reused */
  reuseCount: number;
  
  /** Creation timestamp */
  createdAt: number;
  
  /** Last updated timestamp */
  updatedAt: number;
  
  /** Source: 'local' for personal, 'team' for shared */
  source: 'local' | 'team';
}

export interface PatternFilter {
  search: string;
  tool: Tool | 'all';
  outcome: Outcome | 'all';
  tags: string[];
}

export const DEFAULT_PATTERN: Omit<Pattern, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  description: '',
  tool: 'claude-code',
  prompt: '',
  solution: '',
  tags: [],
  outcome: 'success',
  reuseCount: 0,
  source: 'local',
};

export const TOOL_OPTIONS: { value: Tool; label: string }[] = [
  { value: 'claude-code', label: 'Claude Code' },
  { value: 'cursor', label: 'Cursor' },
  { value: 'copilot', label: 'GitHub Copilot' },
  { value: 'other', label: 'Other' },
];

export const OUTCOME_OPTIONS: { value: Outcome; label: string }[] = [
  { value: 'success', label: '✅ Success' },
  { value: 'partial', label: '⚠️ Partial' },
  { value: 'failure', label: '❌ Failure' },
];

export const COMMON_TAGS = [
  'typescript',
  'react',
  'api',
  'database',
  'testing',
  'debugging',
  'refactor',
  'bugfix',
  'feature',
  'documentation',
];
