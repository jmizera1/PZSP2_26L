import React, { useState } from 'react';
import './Dashboard.css';
import './Settings.css';

const Toggle = ({ checked, onChange, id }) => (
  <label className="toggle-switch" htmlFor={id}>
    <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <span className="toggle-slider"></span>
  </label>
);

const Settings = ({ currentUser, onLogout, onBack, theme, onThemeChange }) => {
  const [notifications, setNotifications] = useState({ emailNotifs: true, experimentUpdates: true, weeklyDigest: false });
  const [privacy, setPrivacy] = useState({ profilePublic: true, showEmail: false, showOrg: true });
  const [language, setLanguage] = useState('en');
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header"><h2>SCREEN PROJECT</h2></div>
        <div className="sidebar-content">
          <div className="sidebar-section">
            <span className="subtitle">SCREEN TITLE:</span>
            <h3>SETTINGS</h3>
          </div>
          <hr className="divider" />
          <nav className="settings-nav">
            <a href="#appearance" className="settings-nav-item active">Appearance</a>
            <a href="#notifications" className="settings-nav-item">Notifications</a>
            <a href="#privacy" className="settings-nav-item">Privacy</a>
            <a href="#language" className="settings-nav-item">Language</a>
          </nav>
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
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search..." className="search-input" />
          </div>
          <div className="user-actions">
            <div className="user-profile">
              <div className="avatar"><img src="https://i.pravatar.cc/150?img=11" alt={`${currentUser.name} ${currentUser.surname}`} /></div>
              <span className="username">{currentUser.name} {currentUser.surname}</span>
            </div>
          </div>
        </header>

        <main className="settings-content">
          <button className="profile-back" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Profile
          </button>
          <h1 className="settings-page-title">Settings</h1>

          {saved && <div className="settings-toast">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Settings saved successfully
          </div>}

          {/* Appearance */}
          <section className="settings-section" id="appearance">
            <div className="settings-section-header"><h2>Appearance</h2></div>
            <div className="settings-card">
              <div className="settings-row">
                <div className="settings-row-info">
                  <span className="settings-row-title">Color Theme</span>
                  <span className="settings-row-desc">Switch between dark and sky blue / white themes</span>
                </div>
                <div className="theme-switcher">
                  <button className={`theme-option ${theme === 'dark' ? 'active' : ''}`} onClick={() => onThemeChange('dark')} id="theme-dark-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    Dark
                  </button>
                  <button className={`theme-option ${theme === 'light' ? 'active' : ''}`} onClick={() => onThemeChange('light')} id="theme-light-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/></svg>
                    Sky Blue
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="settings-section" id="notifications">
            <div className="settings-section-header"><h2>Notifications</h2></div>
            <div className="settings-card">
              <div className="settings-row">
                <div className="settings-row-info"><span className="settings-row-title">Email Notifications</span><span className="settings-row-desc">Receive important updates via email</span></div>
                <Toggle id="toggle-email" checked={notifications.emailNotifs} onChange={(v) => setNotifications(p => ({ ...p, emailNotifs: v }))} />
              </div>
              <div className="settings-row">
                <div className="settings-row-info"><span className="settings-row-title">Experiment Updates</span><span className="settings-row-desc">Get notified when new results are added</span></div>
                <Toggle id="toggle-exp" checked={notifications.experimentUpdates} onChange={(v) => setNotifications(p => ({ ...p, experimentUpdates: v }))} />
              </div>
              <div className="settings-row">
                <div className="settings-row-info"><span className="settings-row-title">Weekly Digest</span><span className="settings-row-desc">Receive a weekly summary of activity</span></div>
                <Toggle id="toggle-digest" checked={notifications.weeklyDigest} onChange={(v) => setNotifications(p => ({ ...p, weeklyDigest: v }))} />
              </div>
            </div>
          </section>

          {/* Privacy */}
          <section className="settings-section" id="privacy">
            <div className="settings-section-header"><h2>Privacy</h2></div>
            <div className="settings-card">
              <div className="settings-row">
                <div className="settings-row-info"><span className="settings-row-title">Public Profile</span><span className="settings-row-desc">Allow others to see your profile</span></div>
                <Toggle id="toggle-public" checked={privacy.profilePublic} onChange={(v) => setPrivacy(p => ({ ...p, profilePublic: v }))} />
              </div>
              <div className="settings-row">
                <div className="settings-row-info"><span className="settings-row-title">Show Email</span><span className="settings-row-desc">Display email on your public profile</span></div>
                <Toggle id="toggle-email-vis" checked={privacy.showEmail} onChange={(v) => setPrivacy(p => ({ ...p, showEmail: v }))} />
              </div>
              <div className="settings-row">
                <div className="settings-row-info"><span className="settings-row-title">Show Organisation</span><span className="settings-row-desc">Display organisation on your profile</span></div>
                <Toggle id="toggle-org" checked={privacy.showOrg} onChange={(v) => setPrivacy(p => ({ ...p, showOrg: v }))} />
              </div>
            </div>
          </section>

          {/* Language */}
          <section className="settings-section" id="language">
            <div className="settings-section-header"><h2>Language</h2></div>
            <div className="settings-card">
              <div className="settings-row">
                <div className="settings-row-info"><span className="settings-row-title">Display Language</span><span className="settings-row-desc">Choose your preferred language</span></div>
                <select className="settings-select" value={language} onChange={(e) => setLanguage(e.target.value)} id="language-select">
                  <option value="en">English</option>
                  <option value="pl">Polski</option>
                  <option value="de">Deutsch</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
          </section>

          <div className="settings-save-area">
            <button className="settings-save-btn" onClick={handleSave} id="save-settings-btn">Save Changes</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
