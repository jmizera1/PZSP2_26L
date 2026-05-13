import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

/* ─── Example / default data shown when no experiment is selected ─── */
const DEFAULT_RESULTS = [
  {
    result_id: 'ex-1',
    platform_name: 'JADE',
    workload: 'Message passing benchmark',
    number_of_agents: 50,
    number_of_repetitions: 10,
    number_of_containers: 3,
    message_size: 512,
    group_size: 5,
    ram: 4.0,
    vcpu: '2',
  },
  {
    result_id: 'ex-2',
    platform_name: 'SPADE',
    workload: 'Contract-net protocol',
    number_of_agents: 100,
    number_of_repetitions: 5,
    number_of_containers: 5,
    message_size: 1024,
    group_size: 10,
    ram: 8.0,
    vcpu: '4',
  },
];

const DEFAULT_METRICS = [
  { experiment_metric_id: 'em-1', metric_name: 'Throughput', metric_unit: 'msg/s', value: 1250, result_result_id: 'ex-1' },
  { experiment_metric_id: 'em-2', metric_name: 'Latency', metric_unit: 'ms', value: 42.3, result_result_id: 'ex-1' },
  { experiment_metric_id: 'em-3', metric_name: 'CPU Usage', metric_unit: '%', value: 67.8, result_result_id: 'ex-1' },
  { experiment_metric_id: 'em-4', metric_name: 'Throughput', metric_unit: 'msg/s', value: 980, result_result_id: 'ex-2' },
  { experiment_metric_id: 'em-5', metric_name: 'Latency', metric_unit: 'ms', value: 58.1, result_result_id: 'ex-2' },
  { experiment_metric_id: 'em-6', metric_name: 'CPU Usage', metric_unit: '%', value: 82.4, result_result_id: 'ex-2' },
];

const DEFAULT_EXPERIMENT = {
  name: 'Example Experiment',
  description: 'This is a sample experiment demonstrating the dashboard layout. Select a real experiment from search to see actual data from the database.',
  creation_date: '2026-01-15',
};

const DEFAULT_AUTHOR = {
  name: 'Sample',
  surname: 'Author',
  org: 'Demo University',
  email: 'demo@example.com',
};

/* ─── Simple bar chart drawn with CSS ─── */
const SimpleBarChart = ({ data, label, unit }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="simple-chart">
      <span className="chart-label">{label}</span>
      <div className="chart-bars">
        {data.map((d, i) => (
          <div className="chart-bar-group" key={i}>
            <div
              className="chart-bar"
              style={{ height: `${(d.value / max) * 100}%` }}
              title={`${d.value} ${unit}`}
            >
              <span className="chart-bar-value">{d.value}</span>
            </div>
            <span className="chart-bar-label">{d.platform || `#${i + 1}`}</span>
          </div>
        ))}
      </div>
      <span className="chart-unit">{unit}</span>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────── */

const Dashboard = ({ experiment = null, currentUser, onLogout, onProfileClick, onBack, onUploadClick }) => {
  const [activeTab, setActiveTab] = useState('Results');
  const tabs = ['Results', 'Plots', 'More Information'];

  const isLoggedIn = currentUser && !currentUser.guest;

  // Data state
  const [results, setResults] = useState(DEFAULT_RESULTS);
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);
  const [expData, setExpData] = useState(DEFAULT_EXPERIMENT);
  const [author, setAuthor] = useState(DEFAULT_AUTHOR);
  const isDefault = !experiment;

  useEffect(() => {
    if (!experiment) return;

    // Fetch experiment detail
    fetch(`${API_URL}/experiments/${experiment.experiment_id}`)
      .then(r => r.json())
      .then(data => { if (data) setExpData(data); })
      .catch(() => {});

    // Fetch results
    fetch(`${API_URL}/experiments/${experiment.experiment_id}/results`)
      .then(r => r.json())
      .then(data => setResults(data && data.length ? data : []))
      .catch(() => setResults([]));

    // Fetch metrics
    fetch(`${API_URL}/experiments/${experiment.experiment_id}/metrics`)
      .then(r => r.json())
      .then(data => setMetrics(data && data.length ? data : []))
      .catch(() => setMetrics([]));

    // Fetch author
    fetch(`${API_URL}/users/${experiment.user_id}`)
      .then(r => r.json())
      .then(data => { if (data) setAuthor(data); })
      .catch(() => {});
  }, [experiment]);

  /* ─── Build chart datasets ─── */
  const buildChartData = (metricName) => {
    const filtered = metrics.filter(m => m.metric_name === metricName);
    return filtered.map(m => {
      const res = results.find(r => String(r.result_id) === String(m.result_result_id));
      return { value: m.value, platform: res?.platform_name || '?' };
    });
  };

  const uniqueMetricNames = [...new Set(metrics.map(m => m.metric_name))];

  /* ─── Renders ─── */

  const renderResultsTab = () => (
    <div className="tab-inner-content">
      {isDefault && (
        <div className="example-banner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>Showing example data. Use search to load a real experiment.</span>
        </div>
      )}
      {results.length === 0 ? (
        <p className="empty-state">No results available for this experiment.</p>
      ) : (
        <div className="results-table-wrapper">
          <table className="results-table">
            <thead>
              <tr>
                <th>Platform</th>
                <th>Workload</th>
                <th>Agents</th>
                <th>Repetitions</th>
                <th>Containers</th>
                <th>Msg Size</th>
                <th>Group</th>
                <th>RAM (GB)</th>
                <th>vCPU</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={r.result_id || i}>
                  <td className="cell-platform">{r.platform_name || '—'}</td>
                  <td>{r.workload || '—'}</td>
                  <td>{r.number_of_agents ?? '—'}</td>
                  <td>{r.number_of_repetitions ?? '—'}</td>
                  <td>{r.number_of_containers ?? '—'}</td>
                  <td>{r.message_size ?? '—'}</td>
                  <td>{r.group_size ?? '—'}</td>
                  <td>{r.ram ?? '—'}</td>
                  <td>{r.vcpu || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderPlotsTab = () => (
    <div className="tab-inner-content">
      {isDefault && (
        <div className="example-banner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>Showing example plots. Load a real experiment for actual data.</span>
        </div>
      )}
      {metrics.length === 0 ? (
        <p className="empty-state">No metric data available to plot.</p>
      ) : (
        <div className="plots-grid">
          {uniqueMetricNames.map(name => {
            const data = buildChartData(name);
            const unit = metrics.find(m => m.metric_name === name)?.metric_unit || '';
            return (
              <SimpleBarChart key={name} data={data} label={name} unit={unit} />
            );
          })}
        </div>
      )}
    </div>
  );

  const renderMoreInfoTab = () => (
    <div className="tab-inner-content more-info">
      {isDefault && (
        <div className="example-banner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>Showing example details. Load a real experiment for actual data.</span>
        </div>
      )}
      <div className="info-grid">
        <div className="info-block">
          <span className="info-block-label">EXPERIMENT NAME</span>
          <span className="info-block-value">{expData.name}</span>
        </div>
        <div className="info-block">
          <span className="info-block-label">CREATION DATE</span>
          <span className="info-block-value">{expData.creation_date || '—'}</span>
        </div>
        <div className="info-block full-width">
          <span className="info-block-label">DESCRIPTION</span>
          <span className="info-block-value">{expData.description || 'No description provided.'}</span>
        </div>
        <div className="info-block">
          <span className="info-block-label">TOTAL RESULTS</span>
          <span className="info-block-value">{results.length}</span>
        </div>
        <div className="info-block">
          <span className="info-block-label">TOTAL METRICS</span>
          <span className="info-block-value">{metrics.length}</span>
        </div>
        <div className="info-block">
          <span className="info-block-label">UNIQUE METRIC TYPES</span>
          <span className="info-block-value">{uniqueMetricNames.length}</span>
        </div>
        <div className="info-block">
          <span className="info-block-label">PLATFORMS TESTED</span>
          <span className="info-block-value">
            {[...new Set(results.map(r => r.platform_name).filter(Boolean))].join(', ') || '—'}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* ─── Sidebar: author info ─── */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>SCREEN PROJECT</h2>
        </div>

        <div className="sidebar-content sidebar-author">
          <div className="author-avatar-wrapper">
            <div className="author-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M20 21a8 8 0 1 0-16 0" />
              </svg>
            </div>
          </div>
          <h3 className="author-name">{author.name} {author.surname}</h3>
          <span className="author-org">{author.org || 'No organisation'}</span>
          <hr className="divider" />
          <div className="author-detail">
            <span className="author-detail-label">EMAIL</span>
            <span className="author-detail-value">{author.email}</span>
          </div>
          <hr className="divider" />
          <div className="author-detail">
            <span className="author-detail-label">EXPERIMENT</span>
            <span className="author-detail-value">{expData.name}</span>
          </div>
          {!isDefault && (
            <>
              <hr className="divider" />
              <div className="author-detail">
                <span className="author-detail-label">CREATED</span>
                <span className="author-detail-value">{expData.creation_date || '—'}</span>
              </div>
            </>
          )}
        </div>

        <div className="sidebar-footer" onClick={onLogout}>
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>LOG OUT</span>
        </div>
      </aside>

      {/* ─── Main panel ─── */}
      <div className="main-panel">
        <header className="header">
          <div className="search-container">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder="Search..." className="search-input" />
          </div>

          <div className="user-actions">
            {isLoggedIn && (
              <button 
                className="profile-action-btn btn-upload" 
                onClick={onUploadClick}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', marginRight: '6px', verticalAlign: 'middle' }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload new research
              </button>
            )}
            <div
              className={`user-profile ${isLoggedIn ? 'clickable' : ''}`}
              onClick={isLoggedIn ? onProfileClick : undefined}
              title={isLoggedIn ? 'View profile' : undefined}
            >
              <div className="avatar">
                {isLoggedIn ? (
                  <img src="https://i.pravatar.cc/150?img=11" alt={`${currentUser.name} ${currentUser.surname}`} />
                ) : (
                  <svg className="avatar-placeholder" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M20 21a8 8 0 1 0-16 0" />
                  </svg>
                )}
              </div>
              <span className="username">{isLoggedIn ? `${currentUser.name} ${currentUser.surname}` : 'unsigned user'}</span>
            </div>
          </div>
        </header>

        <main className="content-area">
          <div className="page-header">
            {onBack && (
              <button className="dash-back-btn" onClick={onBack}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back
              </button>
            )}
            <p className="breadcrumb">SCREEN PROJECT</p>
            <h1 className="page-title">{expData.name}</h1>
          </div>

          <div className="tabs-wrapper">
            <div className="tabs-header">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="tab-content-box">
              {activeTab === 'Results' && renderResultsTab()}
              {activeTab === 'Plots' && renderPlotsTab()}
              {activeTab === 'More Information' && renderMoreInfoTab()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;