import React, { useState } from 'react';
import './UploadResearch.css';
import './Dashboard.css';

const UploadResearch = ({ currentUser, onLogout, onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    platform_name: '',
    workload: '',
    number_of_agents: '',
    number_of_repetitions: '',
    number_of_containers: '',
    message_size: '',
    group_size: '',
    ram: '',
    vcpu: '',
    throughput: '',
    latency: '',
    cpu_usage: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [activePreviewTab, setActivePreviewTab] = useState('Results');
  const previewTabs = ['Results', 'Plots', 'More Information'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001';

    const payload = {
      name: formData.name,
      description: formData.description,
      platform_name: formData.platform_name,
      workload: formData.workload,
      number_of_agents: parseInt(formData.number_of_agents, 10),
      number_of_repetitions: parseInt(formData.number_of_repetitions, 10),
      number_of_containers: parseInt(formData.number_of_containers, 10),
      message_size: parseInt(formData.message_size, 10),
      group_size: parseInt(formData.group_size, 10),
      ram: parseFloat(formData.ram),
      vcpu: formData.vcpu,
      throughput: parseFloat(formData.throughput),
      latency: parseFloat(formData.latency),
      cpu_usage: parseFloat(formData.cpu_usage),
      user_id: currentUser.user_id
    };

    try {
      const res = await fetch(`${apiUrl}/experiments/full`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to create experiment. Please check all fields.');
      }

      if (onSuccess) {
        onSuccess();
      } else if (onBack) {
        onBack();
      }
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─── Check if there's enough data to build a preview ─── */
  const hasPreviewData = formData.name || formData.platform_name || formData.throughput;

  const previewResult = {
    platform_name: formData.platform_name || '—',
    workload: formData.workload || '—',
    number_of_agents: formData.number_of_agents || '—',
    number_of_repetitions: formData.number_of_repetitions || '—',
    number_of_containers: formData.number_of_containers || '—',
    message_size: formData.message_size || '—',
    group_size: formData.group_size || '—',
    ram: formData.ram || '—',
    vcpu: formData.vcpu || '—',
  };

  const previewMetrics = [
    { name: 'Throughput', unit: 'msg/s', value: parseFloat(formData.throughput) || 0 },
    { name: 'Latency', unit: 'ms', value: parseFloat(formData.latency) || 0 },
    { name: 'CPU Usage', unit: '%', value: parseFloat(formData.cpu_usage) || 0 },
  ].filter(m => m.value > 0);

  /* ─── Simple bar chart for preview ─── */
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

  const renderPreviewResults = () => (
    <div className="tab-inner-content">
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
            <tr>
              <td className="cell-platform">{previewResult.platform_name}</td>
              <td>{previewResult.workload}</td>
              <td>{previewResult.number_of_agents}</td>
              <td>{previewResult.number_of_repetitions}</td>
              <td>{previewResult.number_of_containers}</td>
              <td>{previewResult.message_size}</td>
              <td>{previewResult.group_size}</td>
              <td>{previewResult.ram}</td>
              <td>{previewResult.vcpu}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPreviewPlots = () => (
    <div className="tab-inner-content">
      {previewMetrics.length === 0 ? (
        <p className="empty-state">Enter metric values in the form to see charts here.</p>
      ) : (
        <div className="plots-grid">
          {previewMetrics.map(m => (
            <SimpleBarChart
              key={m.name}
              data={[{ value: m.value, platform: formData.platform_name || '?' }]}
              label={m.name}
              unit={m.unit}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderPreviewInfo = () => (
    <div className="tab-inner-content more-info">
      <div className="info-grid">
        <div className="info-block">
          <span className="info-block-label">EXPERIMENT NAME</span>
          <span className="info-block-value">{formData.name || 'Untitled'}</span>
        </div>
        <div className="info-block">
          <span className="info-block-label">CREATION DATE</span>
          <span className="info-block-value">{new Date().toISOString().split('T')[0]}</span>
        </div>
        <div className="info-block full-width">
          <span className="info-block-label">DESCRIPTION</span>
          <span className="info-block-value">{formData.description || 'No description provided.'}</span>
        </div>
        <div className="info-block">
          <span className="info-block-label">TOTAL RESULTS</span>
          <span className="info-block-value">1</span>
        </div>
        <div className="info-block">
          <span className="info-block-label">TOTAL METRICS</span>
          <span className="info-block-value">{previewMetrics.length}</span>
        </div>
        <div className="info-block">
          <span className="info-block-label">UNIQUE METRIC TYPES</span>
          <span className="info-block-value">{previewMetrics.length}</span>
        </div>
        <div className="info-block">
          <span className="info-block-label">PLATFORMS TESTED</span>
          <span className="info-block-value">{formData.platform_name || '—'}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container upload-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>SCREEN PROJECT</h2>
        </div>

        <div className="sidebar-content upload-sidebar">
          <div className="sidebar-section">
            <span className="subtitle">ACTIONS:</span>
            <h3>UPLOAD RESEARCH</h3>
          </div>
          <hr className="divider" />
          <div className="sidebar-section">
            <p className="upload-help-text">
              Fill in the details of your multi-agent system experiment. A live preview will appear on the right as you type.
            </p>
          </div>
          <div className="upload-tips">
            <div className="tip-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Platform name must match standard identifiers (e.g. JADE, SPADE).</span>
            </div>
            <div className="tip-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>The preview updates in real time to show how your research will look.</span>
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
          <div className="spacer"></div>
          <div className="user-actions">
            <div className="user-profile">
              <div className="avatar">
                <img src="https://i.pravatar.cc/150?img=11" alt={`${currentUser.name} ${currentUser.surname}`} />
              </div>
              <span className="username">{`${currentUser.name} ${currentUser.surname}`}</span>
            </div>
          </div>
        </header>

        <main className="content-area upload-content-area">
          <div className="page-header">
            <button className="dash-back-btn" onClick={onBack} type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Cancel & Return
            </button>
            <p className="breadcrumb">CONTRIBUTE DATA</p>
            <h1 className="page-title">Upload New Research</h1>
          </div>

          <div className="upload-split-layout">
            {/* Left: Form */}
            <div className="upload-form-column">
              <div className="upload-card">
                {submitError && (
                  <div className="upload-error">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {submitError}
                  </div>
                )}

                <form className="upload-form" onSubmit={handleSubmit}>
                  <div className="form-section">
                    <h3 className="form-section-title">General Information</h3>
                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label>Experiment Name <span className="required">*</span></label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter a concise title" />
                      </div>
                      <div className="form-group full-width">
                        <label>Description <span className="required">*</span></label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} required placeholder="Provide a detailed description of the experiment..." />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3 className="form-section-title">Environment & Workload</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Platform Name <span className="required">*</span></label>
                        <input type="text" name="platform_name" value={formData.platform_name} onChange={handleChange} placeholder="e.g. JADE" required />
                      </div>
                      <div className="form-group">
                        <label>Workload <span className="required">*</span></label>
                        <input type="text" name="workload" value={formData.workload} onChange={handleChange} placeholder="e.g. Message passing" required />
                      </div>
                      <div className="form-group">
                        <label>RAM (GB) <span className="required">*</span></label>
                        <input type="number" step="0.1" name="ram" value={formData.ram} onChange={handleChange} required min="0.1" />
                      </div>
                      <div className="form-group">
                        <label>vCPU <span className="required">*</span></label>
                        <input type="text" name="vcpu" value={formData.vcpu} onChange={handleChange} placeholder="e.g. 2" required />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3 className="form-section-title">Agent Configuration</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Number of Agents <span className="required">*</span></label>
                        <input type="number" name="number_of_agents" value={formData.number_of_agents} onChange={handleChange} required min="1" />
                      </div>
                      <div className="form-group">
                        <label>Number of Repetitions <span className="required">*</span></label>
                        <input type="number" name="number_of_repetitions" value={formData.number_of_repetitions} onChange={handleChange} required min="1" />
                      </div>
                      <div className="form-group">
                        <label>Number of Containers <span className="required">*</span></label>
                        <input type="number" name="number_of_containers" value={formData.number_of_containers} onChange={handleChange} required min="1" />
                      </div>
                      <div className="form-group">
                        <label>Group Size <span className="required">*</span></label>
                        <input type="number" name="group_size" value={formData.group_size} onChange={handleChange} required min="1" />
                      </div>
                      <div className="form-group">
                        <label>Message Size (bytes) <span className="required">*</span></label>
                        <input type="number" name="message_size" value={formData.message_size} onChange={handleChange} required min="1" />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3 className="form-section-title">Metrics</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Throughput (msg/s) <span className="required">*</span></label>
                        <input type="number" step="0.1" name="throughput" value={formData.throughput} onChange={handleChange} required />
                      </div>
                      <div className="form-group">
                        <label>Latency (ms) <span className="required">*</span></label>
                        <input type="number" step="0.1" name="latency" value={formData.latency} onChange={handleChange} required />
                      </div>
                      <div className="form-group">
                        <label>CPU Usage (%) <span className="required">*</span></label>
                        <input type="number" step="0.1" name="cpu_usage" value={formData.cpu_usage} onChange={handleChange} required />
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="upload-submit-btn" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <svg className="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="2" x2="12" y2="6"/>
                            <line x1="12" y1="18" x2="12" y2="22"/>
                            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                            <line x1="2" y1="12" x2="6" y2="12"/>
                            <line x1="18" y1="12" x2="22" y2="12"/>
                            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          Upload Research
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right: Live Preview */}
            <div className="upload-preview-column">
              <div className="preview-header">
                <div className="preview-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  LIVE PREVIEW
                </div>
                <p className="preview-subtitle">This is how your uploaded research will appear</p>
              </div>

              {/* Author info mini card */}
              <div className="preview-author-card">
                <div className="preview-author-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M20 21a8 8 0 1 0-16 0" />
                  </svg>
                </div>
                <div className="preview-author-info">
                  <span className="preview-author-name">{currentUser.name} {currentUser.surname}</span>
                  <span className="preview-author-org">{currentUser.org || 'No organisation'}</span>
                </div>
              </div>

              {/* Experiment title */}
              <div className="preview-exp-header">
                <p className="breadcrumb">SCREEN PROJECT</p>
                <h2 className="preview-exp-title">{formData.name || 'Experiment Title'}</h2>
              </div>

              {/* Tabs preview */}
              {hasPreviewData ? (
                <div className="tabs-wrapper preview-tabs">
                  <div className="tabs-header">
                    {previewTabs.map((tab) => (
                      <button
                        key={tab}
                        className={`tab-btn ${activePreviewTab === tab ? 'active' : ''}`}
                        onClick={() => setActivePreviewTab(tab)}
                        type="button"
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="tab-content-box">
                    {activePreviewTab === 'Results' && renderPreviewResults()}
                    {activePreviewTab === 'Plots' && renderPreviewPlots()}
                    {activePreviewTab === 'More Information' && renderPreviewInfo()}
                  </div>
                </div>
              ) : (
                <div className="preview-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="3" y1="9" x2="21" y2="9"/>
                    <line x1="9" y1="21" x2="9" y2="9"/>
                  </svg>
                  <p>Start filling in the form to see a live preview of your experiment data.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UploadResearch;
