import { useState } from 'react';
import type { Pattern, Tool, Outcome } from '../types';
import { TOOL_OPTIONS, OUTCOME_OPTIONS, COMMON_TAGS } from '../types';

interface PatternFormProps {
  pattern?: Pattern;
  onSave: (pattern: Pattern) => void;
  onCancel: () => void;
}

export function PatternForm({ pattern, onSave, onCancel }: PatternFormProps) {
  const [formData, setFormData] = useState<Partial<Pattern>>(
    pattern || {
      title: '',
      description: '',
      tool: 'claude-code' as Tool,
      prompt: '',
      solution: '',
      tags: [],
      outcome: 'success' as Outcome,
      failureReason: '',
    }
  );

  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = Date.now();
    const newPattern: Pattern = {
      ...formData,
      id: pattern?.id || `pattern-${now}`,
      reuseCount: pattern?.reuseCount || 0,
      createdAt: pattern?.createdAt || now,
      updatedAt: now,
      source: pattern?.source || 'local',
    } as Pattern;

    onSave(newPattern);
  };

  const addTag = () => {
    if (newTag && !formData.tags?.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), newTag],
      });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag) || [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="pattern-form">
      <h2>{pattern ? 'Edit Pattern' : 'New Pattern'}</h2>

      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Fix TypeScript generic errors"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="tool">Tool</label>
          <select
            id="tool"
            value={formData.tool}
            onChange={e => setFormData({ ...formData, tool: e.target.value as Tool })}
          >
            {TOOL_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="outcome">Outcome</label>
          <select
            id="outcome"
            value={formData.outcome}
            onChange={e => setFormData({ ...formData, outcome: e.target.value as Outcome })}
          >
            {OUTCOME_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Task Description *</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          placeholder="What were you trying to accomplish?"
          rows={3}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="prompt">Prompt / Approach</label>
        <textarea
          id="prompt"
          value={formData.prompt}
          onChange={e => setFormData({ ...formData, prompt: e.target.value })}
          placeholder="What did you ask the AI?"
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="solution">Solution / Result *</label>
        <textarea
          id="solution"
          value={formData.solution}
          onChange={e => setFormData({ ...formData, solution: e.target.value })}
          placeholder="What worked? Paste the working code or approach."
          rows={5}
          required
        />
      </div>

      {formData.outcome === 'failure' && (
        <div className="form-group">
          <label htmlFor="failureReason">What Went Wrong?</label>
          <textarea
            id="failureReason"
            value={formData.failureReason}
            onChange={e => setFormData({ ...formData, failureReason: e.target.value })}
            placeholder="Document the failure so you don't repeat it"
            rows={2}
          />
        </div>
      )}

      <div className="form-group">
        <label>Tags</label>
        <div className="tags-input">
          <input
            type="text"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Add tag..."
            list="common-tags"
          />
          <datalist id="common-tags">
            {COMMON_TAGS.map(tag => (
              <option key={tag} value={tag} />
            ))}
          </datalist>
          <button type="button" onClick={addTag} className="btn-secondary">
            Add
          </button>
        </div>
        <div className="tags-list">
          {formData.tags?.map(tag => (
            <span key={tag} className="tag removable">
              {tag}
              <button type="button" onClick={() => removeTag(tag)}>×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {pattern ? 'Update Pattern' : 'Save Pattern'}
        </button>
      </div>
    </form>
  );
}
