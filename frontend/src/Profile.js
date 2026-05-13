import React, { useEffect, useState } from 'react';
import './Profile.css';
import './Dashboard.css';

const Profile = ({ currentUser, onLogout, onBack, onSettingsClick, onUploadClick, onMyResearchClick }) => {
  const [paperCount, setPaperCount] = useState(0);
  const [topTags, setTopTags] = useState([]);

  // Editable text fields (persisted in localStorage for demo)
  const storageKey = `profile_${currentUser.user_id}`;
  const [bio, setBio] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey))?.bio || ''; } catch { return ''; }
  });
  const [diary, setDiary] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey))?.diary || ''; } catch { return ''; }
  });
  const [researchInterests, setResearchInterests] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey))?.researchInterests || ''; } catch { return ''; }
  });
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001';

    fetch(`${apiUrl}/experiments`)
      .then(res => res.json())
      .then(data => {
        const userExps = data.filter(e => e.user_id === currentUser.user_id);
        setPaperCount(userExps.length);

        const tagCounts = {};
        userExps.forEach(exp => {
          const words = (exp.name || '').split(/[\s_-]+/).filter(w => w.length > 2);
          words.forEach(word => {
            const tag = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
          if (exp.description) {
            const descWords = exp.description.split(/[\s,._-]+/).filter(w => w.length > 3);
            descWords.slice(0, 3).forEach(word => {
              const tag = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
              tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
          }
        });

        const sorted = Object.entries(tagCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([tag]) => tag);

        setTopTags(sorted.length > 0 ? sorted : ['Multi-agent', 'Performance', 'Scalability', 'Docker', 'Benchmark']);
      })
      .catch(() => {
        setPaperCount(0);
        setTopTags(['Multi-agent', 'Performance', 'Scalability', 'Docker', 'Benchmark']);
      });
  }, [currentUser.user_id]);

  const handleSaveProfile = () => {
    localStorage.setItem(storageKey, JSON.stringify({ bio, diary, researchInterests }));
    setSavedMsg('Saved!');
    setTimeout(() => setSavedMsg(''), 2000);
  };

  return (
    <div className="dashboard-container profile-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>SCREEN PROJECT</h2>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-section">
            <span className="subtitle">SCREEN TITLE:</span>
            <h3>MY PROFILE</h3>
          </div>
          <hr className="divider" />
          <div className="sidebar-section sidebar-stat">
            <span className="sidebar-stat-number">{paperCount}</span>
            <span className="sidebar-stat-label">Research papers uploaded</span>
          </div>
          <hr className="divider" />
          <div className="sidebar-section">
            <span className="sidebar-tags-title">Top Tags</span>
            <div className="sidebar-tags">
              {topTags.map((tag, i) => (
                <span key={i} className="sidebar-tag">{tag}</span>
              ))}
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

      <div className="main-panel">
        {/* Header */}
        <header className="header">
          <div className="search-container">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder="Search..." className="search-input" />
          </div>

          <div className="user-actions">
            <button className="settings-btn" title="Settings" onClick={onSettingsClick}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </div>
        </header>

        <main className="profile-content">
          {/* Back button */}
          <button className="profile-back" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>

          <div className="profile-two-columns">
            {/* Left column: Profile card */}
            <div className="profile-left-column">
              <div className="profile-card">
                <div className="profile-card-header">
                  <div className="profile-avatar">
                    <img src="https://i.pravatar.cc/150?img=11" alt={`${currentUser.name} ${currentUser.surname}`} />
                  </div>
                  <div className="profile-name-block">
                    <h1>{currentUser.name} {currentUser.surname}</h1>
                    <p>{currentUser.org || 'No organisation'}</p>
                  </div>
                </div>

                <div className="profile-info">
                  <div className="profile-row">
                    <span className="profile-label">Name</span>
                    <span className="profile-value">{currentUser.name}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Surname</span>
                    <span className="profile-value">{currentUser.surname}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Email</span>
                    <span className="profile-value">{currentUser.email}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Organisation</span>
                    <span className="profile-value">{currentUser.org || '—'}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="profile-actions">
                  <button className="profile-action-btn btn-upload" onClick={onUploadClick}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Add New Experiment
                  </button>
                  <button className="profile-action-btn btn-research" onClick={onMyResearchClick}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    Show my research
                  </button>
                </div>
              </div>
            </div>

            {/* Right column: Personal text fields */}
            <div className="profile-right-column">
              <div className="profile-text-card">
                <div className="profile-text-card-header">
                  <h2>About Me</h2>
                  <p className="profile-text-card-sub">This information is visible to others viewing your research.</p>
                </div>

                <div className="profile-text-field">
                  <label htmlFor="profile-bio">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M20 21a8 8 0 1 0-16 0" />
                    </svg>
                    Personal Description
                  </label>
                  <textarea
                    id="profile-bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write a short bio about yourself, your background, and expertise..."
                    rows={4}
                  />
                </div>

                <div className="profile-text-field">
                  <label htmlFor="profile-interests">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    Research Interests
                  </label>
                  <textarea
                    id="profile-interests"
                    value={researchInterests}
                    onChange={(e) => setResearchInterests(e.target.value)}
                    placeholder="e.g. Multi-agent systems, distributed computing, benchmark methodology..."
                    rows={3}
                  />
                </div>

                <div className="profile-text-field">
                  <label htmlFor="profile-diary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                    Personal Diary / Notes
                  </label>
                  <textarea
                    id="profile-diary"
                    value={diary}
                    onChange={(e) => setDiary(e.target.value)}
                    placeholder="Keep personal notes, experiment ideas, or a research diary..."
                    rows={5}
                  />
                </div>

                <div className="profile-text-actions">
                  <button className="profile-save-btn" onClick={handleSaveProfile}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Save Changes
                  </button>
                  {savedMsg && <span className="profile-saved-msg">{savedMsg}</span>}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
