import { useState, useEffect } from 'react';
import type { Pattern, PatternFilter } from './types';
import { Storage } from './storage';
import { PatternCard } from './components/PatternCard';
import { PatternForm } from './components/PatternForm';
import { PatternView } from './components/PatternView';
import { TOOL_OPTIONS, OUTCOME_OPTIONS } from './types';
import './App.css';

type View = 'list' | 'create' | 'edit' | 'view' | 'import' | 'stats';

function App() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
  const [filter, setFilter] = useState<PatternFilter>({
    search: '',
    tool: 'all',
    outcome: 'all',
    tags: [],
  });
  const [importData, setImportData] = useState('');
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);
  const [stats, setStats] = useState(Storage.getStats());

  useEffect(() => {
    refreshPatterns();
  }, []);

  const refreshPatterns = () => {
    setPatterns(Storage.filter(filter));
    setStats(Storage.getStats());
  };

  useEffect(() => {
    refreshPatterns();
  }, [filter]);

  const handleSave = (pattern: Pattern) => {
    Storage.save(pattern);
    refreshPatterns();
    setCurrentView('list');
    setSelectedPattern(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this pattern?')) {
      Storage.delete(id);
      refreshPatterns();
    }
  };

  const handleExport = () => {
    const data = Storage.export();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patternbase-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const result = Storage.import(importData);
    setImportResult({
      success: result.success,
      message: result.success
        ? `Imported ${result.count} patterns`
        : result.error || 'Import failed',
    });
    if (result.success) {
      refreshPatterns();
      setTimeout(() => {
        setCurrentView('list');
        setImportData('');
        setImportResult(null);
      }, 1500);
    }
  };

  const allTags = Storage.getTags();

  const renderHeader = () => (
    <header className="app-header">
      <div className="header-title">
        <h1>PatternBase</h1>
        <span className="header-subtitle">Remember what works</span>
      </div>
      <div className="header-actions">
        <button onClick={() => setCurrentView('stats')} className="btn-icon" title="Statistics">
          📊
        </button>
        <button onClick={() => setCurrentView('import')} className="btn-secondary">
          Import
        </button>
        <button onClick={handleExport} className="btn-secondary">
          Export
        </button>
        <button onClick={() => setCurrentView('create')} className="btn-primary">
          + New Pattern
        </button>
      </div>
    </header>
  );

  const renderFilters = () => (
    <div className="filters">
      <input
        type="text"
        placeholder="Search patterns..."
        value={filter.search}
        onChange={e => setFilter({ ...filter, search: e.target.value })}
        className="search-input"
      />
      <select
        value={filter.tool}
        onChange={e => setFilter({ ...filter, tool: e.target.value as PatternFilter['tool'] })}
      >
        <option value="all">All Tools</option>
        {TOOL_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <select
        value={filter.outcome}
        onChange={e => setFilter({ ...filter, outcome: e.target.value as PatternFilter['outcome'] })}
      >
        <option value="all">All Outcomes</option>
        {OUTCOME_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  const renderList = () => (
    <div className="patterns-list">
      {renderFilters()}
      {patterns.length === 0 ? (
        <div className="empty-state">
          <h3>No patterns yet</h3>
          <p>Start capturing successful agent interactions</p>
          <button onClick={() => setCurrentView('create')} className="btn-primary">
            Create your first pattern
          </button>
        </div>
      ) : (
        <div className="patterns-grid">
          {patterns.map(pattern => (
            <PatternCard
              key={pattern.id}
              pattern={pattern}
              onClick={() => {
                setSelectedPattern(pattern);
                setCurrentView('view');
              }}
              onDelete={(e) => {
                e.stopPropagation();
                handleDelete(pattern.id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderStats = () => (
    <div className="stats-view">
      <div className="stats-header">
        <h2>Statistics</h2>
        <button onClick={() => setCurrentView('list')} className="btn-secondary">
          Back
        </button>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Patterns</div>
        </div>
        <div className="stat-card success">
          <div className="stat-value">{stats.success}</div>
          <div className="stat-label">Successes</div>
        </div>
        <div className="stat-card partial">
          <div className="stat-value">{stats.partial}</div>
          <div className="stat-label">Partial</div>
        </div>
        <div className="stat-card failure">
          <div className="stat-value">{stats.failure}</div>
          <div className="stat-label">Failures</div>
        </div>
      </div>
      {Object.keys(stats.byTool).length > 0 && (
        <div className="stats-section">
          <h3>By Tool</h3>
          <div className="stats-tools">
            {Object.entries(stats.byTool).map(([tool, count]) => (
              <div key={tool} className="stat-row">
                <span className="stat-tool">{tool}</span>
                <span className="stat-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {allTags.length > 0 && (
        <div className="stats-section">
          <h3>Popular Tags</h3>
          <div className="stats-tags">
            {allTags.slice(0, 10).map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderImport = () => (
    <div className="import-view">
      <div className="import-header">
        <h2>Import Patterns</h2>
        <button onClick={() => setCurrentView('list')} className="btn-secondary">
          Back
        </button>
      </div>
      <div className="import-content">
        <p>Paste JSON patterns to import:</p>
        <textarea
          value={importData}
          onChange={e => setImportData(e.target.value)}
          placeholder="[{...}, {...}]"
          rows={10}
        />
        <button onClick={handleImport} className="btn-primary" disabled={!importData.trim()}>
          Import
        </button>
        {importResult && (
          <div className={`import-result ${importResult.success ? 'success' : 'error'}`}>
            {importResult.message}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="app">
      {renderHeader()}
      <main className="app-main">
        {currentView === 'list' && renderList()}
        {currentView === 'create' && (
          <PatternForm
            onSave={handleSave}
            onCancel={() => setCurrentView('list')}
          />
        )}
        {currentView === 'edit' && selectedPattern && (
          <PatternForm
            pattern={selectedPattern}
            onSave={handleSave}
            onCancel={() => setCurrentView('view')}
          />
        )}
        {currentView === 'view' && selectedPattern && (
          <PatternView
            pattern={selectedPattern}
            onEdit={() => setCurrentView('edit')}
            onClose={() => setCurrentView('list')}
            onReuse={() => {
              setSelectedPattern(Storage.getById(selectedPattern.id) || selectedPattern);
            }}
          />
        )}
        {currentView === 'stats' && renderStats()}
        {currentView === 'import' && renderImport()}
      </main>
    </div>
  );
}

export default App;
