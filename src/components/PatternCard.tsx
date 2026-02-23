import type { Pattern } from '../types';

interface PatternCardProps {
  pattern: Pattern;
  onClick: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export function PatternCard({ pattern, onClick, onDelete }: PatternCardProps) {
  const outcomeEmoji = {
    success: '✅',
    partial: '⚠️',
    failure: '❌',
  };

  const toolLabel = {
    'claude-code': 'Claude',
    'cursor': 'Cursor',
    'copilot': 'Copilot',
    'other': 'Other',
  };

  return (
    <div
      onClick={onClick}
      className="pattern-card"
    >
      <div className="pattern-card-header">
        <h3 className="pattern-card-title">{pattern.title}</h3>
        <div className="pattern-card-badges">
          <span className="badge tool">{toolLabel[pattern.tool]}</span>
          <span className={`badge outcome ${pattern.outcome}`}>
            {outcomeEmoji[pattern.outcome]}
          </span>
        </div>
      </div>
      
      <p className="pattern-card-description">
        {pattern.description.length > 120
          ? pattern.description.slice(0, 120) + '...'
          : pattern.description}
      </p>
      
      {pattern.tags.length > 0 && (
        <div className="pattern-card-tags">
          {pattern.tags.slice(0, 4).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
          {pattern.tags.length > 4 && (
            <span className="tag">+{pattern.tags.length - 4}</span>
          )}
        </div>
      )}
      
      <div className="pattern-card-footer">
        <span className="pattern-card-meta">
          Reused {pattern.reuseCount} times
        </span>
        {onDelete && (
          <button
            onClick={onDelete}
            className="btn-icon delete"
            title="Delete pattern"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}
