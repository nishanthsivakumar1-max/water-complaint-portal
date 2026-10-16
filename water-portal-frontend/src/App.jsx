import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [complaints, setComplaints] = useState([]);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    citizenName: '',
    email: '',
    category: 'Pipeline Leakage',
    priority: 'MEDIUM',
    description: '',
    address: ''
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
      showToast('Could not reach backend service', 'error');
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
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        showToast('Complaint broadcasted successfully! 🚀');
        setFormData({
          citizenName: '',
          email: '',
          category: 'Pipeline Leakage',
          priority: 'MEDIUM',
          description: '',
          address: ''
        });
        fetchComplaints();
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
        showToast(`Incident #${id} updated to ${newStatus}`);
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
  const pendingCount = complaints.filter((c) => c.status === 'PENDING').length;
  const inProgressCount = complaints.filter((c) => c.status === 'IN_PROGRESS').length;
  const resolvedCount = complaints.filter((c) => c.status === 'RESOLVED').length;

  // Filter & Search Logic
  const filteredComplaints = complaints.filter((c) => {
    const matchesCategory = filterCategory === 'ALL' || c.category === filterCategory;
    const matchesSearch =
      c.citizenName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="glass-dashboard">
      {/* Dynamic Ambient Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      {/* Floating Notification Toast */}
      {notification && (
        <div className={`glass-toast ${notification.type}`}>
          <span>{notification.type === 'error' ? '⚠️' : '✨'} {notification.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <header className="glass-nav">
        <div className="nav-brand">
          <div className="brand-icon-wrapper">
            <span className="brand-icon">💧</span>
          </div>
          <div>
            <h1>AquaPulse Command</h1>
            <p>Smart Municipal Water Infrastructure & Incident Portal</p>
          </div>
        </div>
        <div className="live-status-pill">
          <span className="pulse-dot"></span>
          <span>System Online & Synced</span>
        </div>
      </header>

      {/* Interactive Analytics KPI Row */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon total">📊</div>
          <div className="kpi-data">
            <h3>{totalCount}</h3>
            <p>Total Incidents</p>
          </div>
        </div>
        <div className="kpi-card pending-card">
          <div className="kpi-icon pending">⏳</div>
          <div className="kpi-data">
            <h3>{pendingCount}</h3>
            <p>Pending Review</p>
          </div>
        </div>
        <div className="kpi-card progress-card">
          <div className="kpi-icon progress">⚡</div>
          <div className="kpi-data">
            <h3>{inProgressCount}</h3>
            <p>Field Crews Active</p>
          </div>
        </div>
        <div className="kpi-card resolved-card">
          <div className="kpi-icon resolved">✅</div>
          <div className="kpi-data">
            <h3>{resolvedCount}</h3>
            <p>Successfully Resolved</p>
          </div>
        </div>
      </div>

      {/* Workspace Area */}
      <div className="workspace-grid">
        {/* Left Form Panel */}
        <div className="glass-panel form-panel">
          <div className="panel-header">
            <h2>📝 Dispatch New Ticket</h2>
            <span className="subtitle">Report water pipeline leaks, supply outages, or pressure issues</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Citizen Full Name</label>
              <input
                type="text"
                name="citizenName"
                placeholder="e.g. Sarah Jenkins"
                value={formData.citizenName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Contact Email</label>
              <input
                type="email"
                name="email"
                placeholder="sarah@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Issue Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="Pipeline Leakage">🚰 Pipeline Leakage</option>
                  <option value="No Water Supply">🚫 No Water Supply</option>
                  <option value="Contaminated Water">⚠️ Contaminated Water</option>
                  <option value="Low Pressure">📉 Low Pressure</option>
                </select>
              </div>

              <div className="input-group">
                <label>Priority Level</label>
                <select name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="LOW">🟢 Low Priority</option>
                  <option value="MEDIUM">🟡 Medium Priority</option>
                  <option value="HIGH">🔴 Critical / Urgent</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Location / Landmark Address</label>
              <input
                type="text"
                name="address"
                placeholder="104 Sector 4, Main Avenue"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Detailed Observations</label>
              <textarea
                name="description"
                placeholder="Describe leak intensity, color, or duration..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="glass-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Broadcasting...' : 'Broadcast Report 🚀'}
            </button>
          </form>
        </div>

        {/* Right Incident Feed Panel */}
        <div className="glass-panel feed-panel">
          <div className="feed-top-bar">
            <h2>📡 Active Incident Streams</h2>
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-bar"
                placeholder="Search by name, landmark, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Interactive Filter Pills */}
          <div className="filter-pills">
            {['ALL', 'Pipeline Leakage', 'No Water Supply', 'Contaminated Water', 'Low Pressure'].map(
              (cat) => (
                <button
                  key={cat}
                  className={`pill-btn ${filterCategory === cat ? 'active' : ''}`}
                  onClick={() => setFilterCategory(cat)}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Stream Feed */}
          <div className="tickets-scroll-container">
            {filteredComplaints.length === 0 ? (
              <div className="empty-feed">
                <div className="empty-icon">🌊</div>
                <p>No active incidents found matching your criteria.</p>
              </div>
            ) : (
              filteredComplaints.map((c) => (
                <div key={c.id} className="ticket-card">
                  <div className="ticket-header-row">
                    <span className="ticket-tag">TICKET #{c.id}</span>
                    <span className={`status-pill ${c.status ? c.status.toLowerCase() : 'pending'}`}>
                      {c.status || 'PENDING'}
                    </span>
                  </div>

                  <h4>{c.category}</h4>
                  <p className="ticket-location">📍 {c.address}</p>
                  <p className="ticket-desc">{c.description}</p>

                  <div className="ticket-meta-footer">
                    <div className="author-info">
                      <span>👤 {c.citizenName}</span>
                      <small>{c.email}</small>
                    </div>
                    <div className="action-selector">
                      <label>Status:</label>
                      <select
                        value={c.status || 'PENDING'}
                        onChange={(e) => updateStatus(c.id, e.target.value)}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;