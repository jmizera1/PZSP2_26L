import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = ({ message }) => {
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

        <div className="sidebar-footer">
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          <span>SETTINGS</span>
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
                <img src="https://i.pravatar.cc/150?img=11" alt="John Doe" />
              </div>
              <span className="username">John Doe</span>
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
                  {message || "Loading data..."}
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