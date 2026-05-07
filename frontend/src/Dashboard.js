import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = ({ users = [], currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('ITEM 1');
  const tabs = ['ITEM 1', 'ITEM 2', 'ITEM 3', 'ITEM 4'];

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>SCREEN PROJECT</h2>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-section">
            <span className="subtitle">SCREEN TITLE:</span>
            <h3>DASHBOARD</h3>
          </div>
          <hr className="divider" />
          <div className="sidebar-section"><p>some text</p></div>
          <hr className="divider" />
          <div className="sidebar-section"><p>some text</p></div>
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
            <div className="user-profile">
              <div className="avatar">
                {currentUser && !currentUser.guest ? (
                  <img src="https://i.pravatar.cc/150?img=11" alt={`${currentUser.name} ${currentUser.surname}`} />
                ) : (
                  <svg className="avatar-placeholder" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M20 21a8 8 0 1 0-16 0" />
                  </svg>
                )}
              </div>
              <span className="username">{currentUser && !currentUser.guest ? `${currentUser.name} ${currentUser.surname}` : 'unsigned user'}</span>
            </div>
          </div>
        </header>

        <main className="content-area">
          <div className="page-header">
            <p className="breadcrumb">SCREEN PROJECT</p>
            <h1 className="page-title">{activeTab}</h1>
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
              {activeTab === 'ITEM 1' && (
                <div className="tab-inner-content">
                  {users.length === 0 ? (
                    <p>Loading data...</p>
                  ) : (
                    <ul className="user-list">
                      {users.map((user, index) => (
                        <li key={user.id || index} style={{ marginBottom: '10px' }}>
                          <strong>{`${user.name} ${user.surname}` || "Unknown User"}</strong>
                          {user.email && `: ${user.email}`}
                        </li>
                      ))}
                    </ul>
                  )}

                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;