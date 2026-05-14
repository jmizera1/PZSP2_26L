import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import './SearchExperiments.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

const SearchExperiments = ({ currentUser, onLogout, onProfileClick, onBack, onUploadClick, onExperimentClick }) => {
  const [experiments, setExperiments] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [experimentMeta, setExperimentMeta] = useState({});

  const isLoggedIn = currentUser && !currentUser.guest;

  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};

      const fetchUsersOrResearchers = async () => {
        if (token) {
          const res = await fetch(`${API_URL}/users`, { headers: authHeaders });
          if (res.ok) return res;
        }
        return fetch(`${API_URL}/researchers`);
      };

      const [expRes, usersRes, resultsRes] = await Promise.all([
        fetch(`${API_URL}/experiments`),
        fetchUsersOrResearchers(),
        fetch(`${API_URL}/results`)
      ]);

      const expData = expRes.ok ? await expRes.json() : [];
      const resultsData = resultsRes.ok ? await resultsRes.json() : [];

      let usersData = [];
      if (usersRes.ok) {
        usersData = await usersRes.json();
      } else {
        console.warn("Failed to fetch both private users and public researchers.");
      }

      setExperiments(expData || []);
      setUsers(usersData || []);
        const meta = {};
        (resultsData || []).forEach(r => {
          const eid = r.experiment_experiment_id;
          if (!meta[eid]) meta[eid] = { platforms: new Set(), workloads: new Set(), agents: [] };
          if (r.platform_name) meta[eid].platforms.add(r.platform_name);
          if (r.workload) meta[eid].workloads.add(r.workload);
          if (r.number_of_agents) meta[eid].agents.push(r.number_of_agents);
        });
        setExperimentMeta(meta);
      } catch (err) {
        console.error('Failed to fetch experiments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getUserName = (userId) => {
    const u = users.find(u => u.user_id === userId);
    return u ? `${u.name} ${u.surname}` : 'Unknown';
  };

  const getUserOrg = (userId) => {
    const u = users.find(u => u.user_id === userId);
    return u?.org || '';
  };

  const getTags = (exp) => {
    const meta = experimentMeta[exp.experiment_id];
    const tags = [];
    if (meta) {
      meta.platforms.forEach(p => tags.push({ label: p, type: 'platform' }));
      meta.workloads.forEach(w => tags.push({ label: w, type: 'workload' }));
      if (meta.agents.length > 0) {
        const maxAgents = Math.max(...meta.agents);
        tags.push({ label: `${maxAgents} agents`, type: 'agents' });
      }
    }
    // Add date tag
    if (exp.creation_date) {
      tags.push({ label: exp.creation_date, type: 'date' });
    }
    return tags;
  };

  // Collect all unique platforms for filter
  const allPlatforms = [...new Set(
    Object.values(experimentMeta).flatMap(m => [...m.platforms])
  )];

  // Filter experiments
  const filtered = experiments.filter(exp => {
    const q = searchQuery.toLowerCase();
    const nameMatch = (exp.name || '').toLowerCase().includes(q);
    const descMatch = (exp.description || '').toLowerCase().includes(q);
    const authorMatch = getUserName(exp.user_id).toLowerCase().includes(q);

    const tags = getTags(exp);
    const tagMatch = tags.some(t => t.label.toLowerCase().includes(q));

    const textOk = !q || nameMatch || descMatch || authorMatch || tagMatch;

    let platformOk = true;
    if (selectedPlatformFilter !== 'All') {
      const meta = experimentMeta[exp.experiment_id];
      platformOk = meta ? meta.platforms.has(selectedPlatformFilter) : false;
    }

    return textOk && platformOk;
  });

  return (
    <div className="dashboard-container search-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>SCREEN PROJECT</h2>
        </div>

        <div className="sidebar-content search-sidebar">
          <div className="sidebar-section">
            <span className="subtitle">BROWSE:</span>
            <h3>EXPERIMENTS</h3>
          </div>
          <hr className="divider" />

          {/* Platform filters */}
          <div className="sidebar-section">
            <span className="search-filter-title">FILTER BY PLATFORM</span>
            <div className="search-filter-chips">
              <button
                className={`filter-chip ${selectedPlatformFilter === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedPlatformFilter('All')}
              >All</button>
              {allPlatforms.map(p => (
                <button
                  key={p}
                  className={`filter-chip ${selectedPlatformFilter === p ? 'active' : ''}`}
                  onClick={() => setSelectedPlatformFilter(p)}
                >{p}</button>
              ))}
            </div>
          </div>
          <hr className="divider" />

          {/* Stats */}
          <div className="sidebar-section search-stats">
            <div className="search-stat">
              <span className="search-stat-number">{experiments.length}</span>
              <span className="search-stat-label">Total experiments</span>
            </div>
            <div className="search-stat">
              <span className="search-stat-number">{filtered.length}</span>
              <span className="search-stat-label">Matching results</span>
            </div>
          </div>
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

      {/* Main panel */}
      <div className="main-panel">
        <header className="header">
          <div className="search-container search-container-wide">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search experiments by name, author, platform, or keyword..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="search-experiments-input"
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')} title="Clear">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
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

        <main className="content-area search-content-area">
          <div className="page-header">
            <button className="dash-back-btn" onClick={onBack} type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Home
            </button>
            <p className="breadcrumb">SCREEN PROJECT</p>
            <h1 className="page-title">Search Experiments</h1>
          </div>

          {loading ? (
            <div className="search-loading">
              <div className="search-loading-spinner"></div>
              <span>Loading experiments...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="search-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
              <h3>No experiments found</h3>
              <p>Try adjusting your search query or platform filter.</p>
            </div>
          ) : (
            <div className="search-results-list">
              {filtered.map((exp) => {
                const tags = getTags(exp);
                return (
                  <div
                    key={exp.experiment_id}
                    className="search-result-card"
                    onClick={() => onExperimentClick && onExperimentClick(exp)}
                    id={`experiment-${exp.experiment_id}`}
                  >
                    <div className="result-card-top">
                      <div className="result-card-info">
                        <h3 className="result-card-title">{exp.name}</h3>
                        <span className="result-card-author">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M20 21a8 8 0 1 0-16 0" />
                          </svg>
                          {getUserName(exp.user_id)}
                          {getUserOrg(exp.user_id) && (
                            <span className="result-card-org"> · {getUserOrg(exp.user_id)}</span>
                          )}
                        </span>
                      </div>
                      <div className="result-card-arrow">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </div>

                    {exp.description && (
                      <p className="result-card-desc">
                        {exp.description.length > 180
                          ? exp.description.substring(0, 180) + '...'
                          : exp.description}
                      </p>
                    )}

                    {tags.length > 0 && (
                      <div className="result-card-tags">
                        {tags.map((tag, i) => (
                          <span key={i} className={`result-tag result-tag--${tag.type}`}>
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchExperiments;
