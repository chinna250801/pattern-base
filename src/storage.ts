/**
 * Storage Layer - First Principles
 * 
 * - No backend required
 * - localStorage for personal patterns
 * - JSON export/import for team sharing
 * - Git-friendly (no binary data)
 */

import type { Pattern, PatternFilter } from './types';

const STORAGE_KEY = 'patternbase:patterns';

export const Storage = {
  /** Get all patterns from localStorage */
  getAll(): Pattern[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  /** Save pattern (create or update) */
  save(pattern: Pattern): void {
    const patterns = this.getAll();
    const existing = patterns.find(p => p.id === pattern.id);
    
    if (existing) {
      const index = patterns.findIndex(p => p.id === pattern.id);
      patterns[index] = { ...pattern, updatedAt: Date.now() };
    } else {
      patterns.push(pattern);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patterns));
  },

  /** Delete a pattern */
  delete(id: string): void {
    const patterns = this.getAll().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patterns));
  },

  /** Get single pattern by ID */
  getById(id: string): Pattern | undefined {
    return this.getAll().find(p => p.id === id);
  },

  /** Filter patterns */
  filter(filter: PatternFilter): Pattern[] {
    let patterns = this.getAll();

    if (filter.search) {
      const search = filter.search.toLowerCase();
      patterns = patterns.filter(p =>
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.solution.toLowerCase().includes(search) ||
        p.tags.some(t => t.toLowerCase().includes(search))
      );
    }

    if (filter.tool !== 'all') {
      patterns = patterns.filter(p => p.tool === filter.tool);
    }

    if (filter.outcome !== 'all') {
      patterns = patterns.filter(p => p.outcome === filter.outcome);
    }

    if (filter.tags.length > 0) {
      patterns = patterns.filter(p =>
        filter.tags.some(tag => p.tags.includes(tag))
      );
    }

    // Sort by updatedAt desc
    return patterns.sort((a, b) => b.updatedAt - a.updatedAt);
  },

  /** Export all patterns as JSON */
  export(): string {
    const patterns = this.getAll();
    return JSON.stringify(patterns, null, 2);
  },

  /** Import patterns from JSON */
  import(json: string): { success: boolean; count: number; error?: string } {
    try {
      const patterns: Pattern[] = JSON.parse(json);
      if (!Array.isArray(patterns)) {
        return { success: false, count: 0, error: 'Invalid format: expected array' };
      }
      
      const current = this.getAll();
      const merged = [...current];
      
      let added = 0;
      patterns.forEach(p => {
        if (!merged.find(m => m.id === p.id)) {
          merged.push({ ...p, source: 'team' });
          added++;
        }
      });
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return { success: true, count: added };
    } catch (e) {
      return { success: false, count: 0, error: 'Invalid JSON' };
    }
  },

  /** Clear all patterns */
  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  /** Get unique tags from all patterns */
  getTags(): string[] {
    const patterns = this.getAll();
    const tags = new Set<string>();
    patterns.forEach(p => p.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  },

  /** Get statistics */
  getStats(): {
    total: number;
    success: number;
    partial: number;
    failure: number;
    byTool: Record<string, number>;
  } {
    const patterns = this.getAll();
    return {
      total: patterns.length,
      success: patterns.filter(p => p.outcome === 'success').length,
      partial: patterns.filter(p => p.outcome === 'partial').length,
      failure: patterns.filter(p => p.outcome === 'failure').length,
      byTool: patterns.reduce((acc, p) => {
        acc[p.tool] = (acc[p.tool] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  },
};
