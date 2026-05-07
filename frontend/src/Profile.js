import React from 'react';
import './Profile.css';
import './Dashboard.css';

const Profile = ({ currentUser, onLogout, onBack }) => {
  return (
    <div className="dashboard-container profile-page">
      {/* Reuse sidebar */}
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
          <div className="sidebar-section"><p>Personal data</p></div>
          <hr className="divider" />
          <div className="sidebar-section"><p>Research</p></div>
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
        {/* Reuse header */}
        <header className="header">
          <div className="search-container">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder="Search..." className="search-input" />
          </div>

          <div className="user-actions">
            <div className="user-profile">
              <div className="avatar">
                <img src="https://i.pravatar.cc/150?img=11" alt={`${currentUser.name} ${currentUser.surname}`} />
              </div>
              <span className="username">{currentUser.name} {currentUser.surname}</span>
            </div>
          </div>
        </header>

        <main className="profile-content">
          {/* Back button */}
          <button className="profile-back" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Dashboard
          </button>

          {/* Profile card */}
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
              <button className="profile-action-btn btn-upload">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload new research
              </button>
              <button className="profile-action-btn btn-research">
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
        </main>
      </div>
    </div>
  );
};

export default Profile;
