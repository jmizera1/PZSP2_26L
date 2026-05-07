import React from 'react';
import './Dashboard.css';
import './Welcome.css';

const Welcome = ({ currentUser, onLogout, onProfileClick, onStartSearching }) => {
  const isLoggedIn = currentUser && !currentUser.guest;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>SCREEN PROJECT</h2>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-section">
            <span className="subtitle">SCREEN TITLE:</span>
            <h3>WELCOME</h3>
          </div>
          <hr className="divider" />
          <div className="sidebar-section">
            <p>Multi-agent research platform</p>
          </div>
          <hr className="divider" />
          <div className="sidebar-section">
            <p>Explore & analyse experiments</p>
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
        <header className="header">
          <div className="search-container">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder="Search..." className="search-input" />
          </div>

          <div className="user-actions">
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

        <main className="content-area welcome-content">
          {/* Hero section */}
          <div className="welcome-hero">
            <div className="welcome-hero-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>

            <h1 className="welcome-title">
              Welcome{isLoggedIn ? `, ${currentUser.name}` : ''}!
            </h1>

            <p className="welcome-subtitle">
              Multi-Agent Systems Research Platform
            </p>

            <div className="welcome-description">
              <p>
                <strong>SCREEN PROJECT</strong> is a collaborative platform for managing, exploring, and
                analysing multi-agent systems experiments. Upload your research, browse published
                results, and discover insights through powerful search and filtering tools.
              </p>
              <p>
                Whether you're benchmarking agent performance, comparing simulation strategies, or
                reviewing peer research — this platform gives you the tools to organise, search, and
                collaborate more efficiently.
              </p>
            </div>

            <button className="welcome-start-btn" onClick={onStartSearching} id="start-searching-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              START SEARCHING
            </button>
          </div>

          {/* Feature cards */}
          <div className="welcome-features">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <h3>Upload Research</h3>
              <p>Share your experiments and results with the community.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3>Search & Discover</h3>
              <p>Find relevant experiments using advanced search and filters.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <h3>Analyse Results</h3>
              <p>Compare benchmarks and uncover trends across experiments.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Welcome;
