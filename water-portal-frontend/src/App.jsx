import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    citizenName: '',
    email: '',
    contactNumber: '',
    category: 'Pipe Leakage',
    wardNumber: 'Ward 01 - North Zone',
    severity: 'Medium',
    address: '',
    description: ''
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchComplaints = async () => {
    try {
      const response = await fetch('/api/complaints');
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenName: formData.citizenName,
          email: formData.email,
          category: formData.category,
          priority: formData.severity.toUpperCase(),
          description: `[${formData.wardNumber}] ${formData.description}`,
          address: formData.address
        })
      });

      if (response.ok) {
        showToast('Complaint registered successfully! 🚀');
        setFormData({
          citizenName: '',
          email: '',
          contactNumber: '',
          category: 'Pipe Leakage',
          wardNumber: 'Ward 01 - North Zone',
          severity: 'Medium',
          address: '',
          description: ''
        });
        fetchComplaints();
        setActiveTab('track');
      } else {
        showToast('Submission failed. Check backend connection.', 'error');
      }
    } catch (error) {
      showToast('Submission failed. Check backend connection.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        showToast(`Ticket #${id} status updated to ${newStatus}`);
        fetchComplaints();
      } else {
        showToast('Failed to modify status', 'error');
      }
    } catch (error) {
      showToast('Failed to modify status', 'error');
    }
  };

  // Metrics
  const totalCount = complaints.length;
  const resolvedCount = complaints.filter((c) => c.status === 'RESOLVED').length;
  const pendingCount = complaints.filter((c) => c.status === 'PENDING' || c.status === 'IN_PROGRESS' || !c.status).length;
  const emergencyCount = complaints.filter((c) => c.priority === 'HIGH' || c.priority === 'EMERGENCY').length;

  const filteredComplaints = complaints.filter((c) =>
    c.citizenName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`ag-app-container ${darkMode ? 'dark-theme' : ''}`}>
      {/* Toast Notification */}
      {notification && (
        <div className={`ag-toast ${notification.type}`}>
          <span>{notification.type === 'error' ? '⚠️' : '✨'} {notification.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="ag-navbar">
        <div className="ag-nav-brand" onClick={() => setActiveTab('overview')}>
          <div className="ag-logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" className="ag-droplet-svg">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <div className="ag-logo-text">
            <h2>AquaGuard</h2>
            <p>WATER UTILITY PORTAL</p>
          </div>
        </div>

        {/* Tab Pills */}
        <nav className="ag-nav-pills">
          <button
            className={`ag-pill-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="ag-pill-icon">📊</span> Overview
          </button>
          <button
            className={`ag-pill-btn ${activeTab === 'submit' ? 'active' : ''}`}
            onClick={() => setActiveTab('submit')}
          >
            <span className="ag-pill-icon">📝</span> Submit Complaint
          </button>
          <button
            className={`ag-pill-btn ${activeTab === 'track' ? 'active' : ''}`}
            onClick={() => setActiveTab('track')}
          >
            <span className="ag-pill-icon">📋</span> Track & Manage
          </button>
          <button
            className={`ag-pill-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <span className="ag-pill-icon">📈</span> Live Stats
          </button>
          <button
            className={`ag-pill-btn ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            <span className="ag-pill-icon">❓</span> FAQ & Help
          </button>
        </nav>

        {/* Dark Mode Toggle Button */}
        <button className="ag-theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      {/* Main Container */}
      <main className="ag-main-content">
        {activeTab === 'overview' && (
          <div className="ag-overview-wrapper">
            {/* Hero Blue Banner */}
            <div className="ag-hero-banner">
              <div className="ag-hero-content">
                <span className="ag-hero-tag">CITIZEN FIRST INITIATIVE</span>
                <h1 className="ag-hero-title">
                  Smart Water Supply &<br />Grievance Redressal
                </h1>
                <p className="ag-hero-subtitle">
                  Report pipeline leakages, water contamination, pressure drops, or drainage<br />
                  issues instantly. Track real-time progress and help us secure our water future.
                </p>

                <div className="ag-hero-actions">
                  <button className="ag-btn-primary" onClick={() => setActiveTab('submit')}>
                    <span className="ag-btn-plus">+</span> Register New Complaint
                  </button>
                  <button className="ag-btn-secondary" onClick={() => setActiveTab('track')}>
                    🔍 Track Complaints
                  </button>
                </div>
              </div>

              {/* Decorative Waves */}
              <div className="ag-wave-decoration">
                <svg viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="6" opacity="0.15">
                  <path d="M 0 30 Q 25 10, 50 30 T 100 30 T 150 30 T 200 30" />
                  <path d="M 0 55 Q 25 35, 50 55 T 100 55 T 150 55 T 200 55" />
                  <path d="M 0 80 Q 25 60, 50 80 T 100 80 T 150 80 T 200 80" />
                </svg>
              </div>
            </div>

            {/* Live Stat Cards Grid */}
            <div className="ag-stats-grid">
              <div className="ag-stat-card">
                <div className="ag-stat-info">
                  <span className="ag-stat-label">Total Registered</span>
                  <h3 className="ag-stat-value">{totalCount}</h3>
                  <span className="ag-stat-footnote cyan-text">🗄️ Permanent Storage</span>
                </div>
                <div className="ag-stat-icon-badge cyan-badge">📁</div>
              </div>

              <div className="ag-stat-card">
                <div className="ag-stat-info">
                  <span className="ag-stat-label">Resolved Cases</span>
                  <h3 className="ag-stat-value green-text">{resolvedCount}</h3>
                  <span className="ag-stat-footnote green-text">✓ Successfully Closed</span>
                </div>
                <div className="ag-stat-icon-badge green-badge">✓</div>
              </div>

              <div className="ag-stat-card">
                <div className="ag-stat-info">
                  <span className="ag-stat-label">Pending / In Progress</span>
                  <h3 className="ag-stat-value orange-text">{pendingCount}</h3>
                  <span className="ag-stat-footnote orange-text">⏰ Awaiting Action</span>
                </div>
                <div className="ag-stat-icon-badge orange-badge">⏳</div>
              </div>

              <div className="ag-stat-card">
                <div className="ag-stat-info">
                  <span className="ag-stat-label">Emergency Alerts</span>
                  <h3 className="ag-stat-value red-text">{emergencyCount}</h3>
                  <span className="ag-stat-footnote red-text">⚠️ High Priority</span>
                </div>
                <div className="ag-stat-icon-badge red-badge">⚡</div>
              </div>
            </div>

            {/* Bottom Section: Recent Submissions + Emergency Widget */}
            <div className="ag-bottom-grid">
              {/* Left Column: Recent Submissions */}
              <div className="ag-card-panel ag-submissions-panel">
                <div className="ag-panel-header">
                  <div>
                    <h2 className="ag-panel-title">Recent Submissions</h2>
                    <p className="ag-panel-subtitle">Latest water grievance reports logged in browser memory</p>
                  </div>
                  <button className="ag-link-btn" onClick={() => setActiveTab('track')}>
                    View All →
                  </button>
                </div>

                <div className="ag-submissions-list">
                  {complaints.length === 0 ? (
                    <div className="ag-empty-state">No complaints logged yet.</div>
                  ) : (
                    complaints.slice(0, 3).map((item) => (
                      <div key={item.id} className="ag-submission-item">
                        <div className="ag-sub-item-header">
                          <span className="ag-ticket-id">AQ-{1000 + item.id}</span>
                          <span className={`ag-pill-status ${(item.status || 'PENDING').toLowerCase()}`}>
                            {item.status || 'In Progress'}
                          </span>
                          <span className={`ag-pill-priority ${(item.priority || 'MEDIUM').toLowerCase()}`}>
                            {item.priority || 'Medium'}
                          </span>
                        </div>

                        <h4 className="ag-sub-item-title">
                          {item.category} <span className="ag-ward-tag">- Ward 03</span>
                        </h4>
                        <p className="ag-sub-item-location">📍 {item.address}</p>

                        <button className="ag-view-details-btn" onClick={() => setActiveTab('track')}>
                          View Details
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Emergency Hotline Card */}
              <div className="ag-card-panel ag-hotline-panel">
                <div className="ag-hotline-icon">💡</div>

                <h2 className="ag-hotline-title">Emergency Water Hotline</h2>
                <p className="ag-hotline-desc">
                  Experiencing major pipe bursts or complete water outage in your neighborhood? Contact
                  our 24/7 dedicated control room immediately.
                </p>

                <div className="ag-hotline-box">
                  <div className="ag-phone-circle">📞</div>
                  <div>
                    <span className="ag-hotline-label">TOLL FREE HELPLINE</span>
                    <h3 className="ag-hotline-number">1800-WATER-HELP</h3>
                  </div>
                </div>

                <div className="ag-hotline-footer">
                  <span>Avg Response Time: <strong>25 mins</strong></span>
                  <span className="ag-status-online">Status: <strong>Operational</strong></span>
                </div>

                <button className="ag-full-submit-btn" onClick={() => setActiveTab('submit')}>
                  Lodge Complaint Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUBMIT COMPLAINT TAB */}
        {activeTab === 'submit' && (
          <div className="ag-card-panel ag-form-container">
            <h2 className="ag-panel-title">Lodge a Water Complaint</h2>
            <p className="ag-panel-subtitle">Fill in the details below to dispatch a response crew.</p>

            <form onSubmit={handleSubmit} className="ag-form">
              <div className="ag-form-row">
                <div className="ag-input-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="citizenName"
                    placeholder="e.g. Rajesh Kumar"
                    value={formData.citizenName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="ag-input-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. rajesh@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="ag-form-row">
                <div className="ag-input-group">
                  <label>Category *</label>
                  <select name="category" value={formData.category} onChange={handleChange}>
                    <option value="Pipe Leakage">Pipe Leakage / Burst</option>
                    <option value="Contaminated Water">Contaminated Water</option>
                    <option value="Low Water Pressure">Low Water Pressure</option>
                    <option value="No Water Supply">No Water Supply</option>
                  </select>
                </div>
                <div className="ag-input-group">
                  <label>Specific Address *</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="e.g. 14 Park Avenue, Near City Hospital"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="ag-input-group">
                <label>Detailed Description *</label>
                <textarea
                  name="description"
                  placeholder="Describe the leak intensity or issue duration..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  required
                />
              </div>

              <button type="submit" className="ag-full-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Lodge Complaint Now'}
              </button>
            </form>
          </div>
        )}

        {/* TRACK & MANAGE TAB */}
        {activeTab === 'track' && (
          <div className="ag-card-panel">
            <div className="ag-panel-header">
              <h2 className="ag-panel-title">Track & Manage Complaints</h2>
              <input
                type="text"
                className="ag-search-input"
                placeholder="Search complaints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="ag-submissions-list">
              {filteredComplaints.length === 0 ? (
                <div className="ag-empty-state">No matching complaints found.</div>
              ) : (
                filteredComplaints.map((item) => (
                  <div key={item.id} className="ag-submission-item ag-track-item">
                    <div className="ag-track-main">
                      <div className="ag-sub-item-header">
                        <span className="ag-ticket-id">AQ-{1000 + item.id}</span>
                        <span className={`ag-pill-status ${(item.status || 'PENDING').toLowerCase()}`}>
                          {item.status || 'PENDING'}
                        </span>
                      </div>
                      <h4 className="ag-sub-item-title">{item.category}</h4>
                      <p className="ag-sub-item-location">📍 {item.address}</p>
                      <p className="ag-track-desc">{item.description}</p>
                    </div>

                    <div className="ag-track-action">
                      <select
                        value={item.status || 'PENDING'}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        className="ag-status-select"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;