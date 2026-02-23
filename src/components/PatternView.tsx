import type { Pattern } from '../types';
import { Storage } from '../storage';

interface PatternViewProps {
  pattern: Pattern;
  onEdit: () => void;
  onClose: () => void;
  onReuse: () => void;
}

export function PatternView({ pattern, onEdit, onClose, onReuse }: PatternViewProps) {
  const handleReuse = () => {
    const updated = { ...pattern, reuseCount: pattern.reuseCount + 1 };
    Storage.save(updated);
    onReuse();
  };

  const outcomeEmoji = {
    success: '✅',
    partial: '⚠️',
    failure: '❌',
  };

  const outcomeLabel = {
    success: 'Success',
    partial: 'Partial Success',
    failure: 'Failure',
  };

  const toolLabel = {
    'claude-code': 'Claude Code',
    'cursor': 'Cursor',
    'copilot': 'GitHub Copilot',
    'other': 'Other',
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="pattern-view">
      <div className="pattern-view-header">
        <h2>{pattern.title}</h2>
        <div className="pattern-view-actions">
          <button onClick={handleReuse} className="btn-success">
            ✓ Used This
          </button>
          <button onClick={onEdit} className="btn-secondary">
            Edit
          </button>
          <button onClick={onClose} className="btn-icon">
            ✕
          </button>
        </div>
      </div>

      <div className="pattern-view-meta">
        <span className={`badge outcome ${pattern.outcome}`}>
          {outcomeEmoji[pattern.outcome]} {outcomeLabel[pattern.outcome]}
        </span>
        <span className="badge tool">{toolLabel[pattern.tool]}</span>
        <span className="meta-item">
          Reused {pattern.reuseCount} times
        </span>
        <span className="meta-item">
          Created: {formatDate(pattern.createdAt)}
        </span>
      </div>

      <div className="pattern-view-content">
        <section>
          <h3>Task Description</h3>
          <p>{pattern.description}</p>
        </section>

        {pattern.prompt && (
          <section>
            <h3>Prompt / Approach</h3>
            <div className="code-block">
              <pre>{pattern.prompt}</pre>
              <button
                onClick={() => copyToClipboard(pattern.prompt)}
                className="btn-copy"
              >
                Copy
              </button>
            </div>
          </section>
        )}

        <section>
          <h3>Solution</h3>
          <div className="code-block">
            <pre>{pattern.solution}</pre>
            <button
              onClick={() => copyToClipboard(pattern.solution)}
              className="btn-copy"
            >
              Copy
            </button>
          </div>
        </section>

        {pattern.failureReason && (
          <section className="failure-section">
            <h3>⚠️ What Went Wrong</h3>
            <p>{pattern.failureReason}</p>
          </section>
        )}

        {pattern.tags.length > 0 && (
          <section>
            <h3>Tags</h3>
            <div className="tags-list">
              {pattern.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
