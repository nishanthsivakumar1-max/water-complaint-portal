import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [complaints, setComplaints] = useState([]);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);

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
      const response = await fetch('http://localhost:8080/api/complaints');
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      }
    } catch (error) {
      showToast('Could not reach backend service', 'error');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        showToast('Complaint registered successfully! 🚀');
        setFormData({
          citizenName: '',
          email: '',
          category: 'Pipeline Leakage',
          priority: 'MEDIUM',
          description: '',
          address: ''
        });
        fetchComplaints();
      }
    } catch (error) {
      showToast('Submission failed. Check backend connection.', 'error');
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        showToast(`Incident #${id} transitioned to ${newStatus}`);
        fetchComplaints();
      }
    } catch (error) {
      showToast('Failed to modify status', 'error');
    }
  };

  // Metrics
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'PENDING').length;
  const inProgressCount = complaints.filter(c => c.status === 'IN_PROGRESS').length;
  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED').length;

  // Filter & Search Logic
  const filteredComplaints = complaints.filter(c => {
    const matchesCategory = filterCategory === 'ALL' || c.category === filterCategory;
    const matchesSearch = c.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="glass-dashboard">
      {/* Ambient Background Glow Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      {/* Floating Notification */}
      {notification && (
        <div className={`glass-toast ${notification.type}`}>
          <span>✨ {notification.message}</span>
        </div>
      )}

      {/* Top Glass Navbar / Header */}
      <header className="glass-nav">
        <div className="nav-brand">
          <span className="brand-icon">💧</span>
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

      {/* Analytics KPI Row */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon total">📊</div>
          <div>
            <h3>{totalCount}</h3>
            <p>Total Incidents</p>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon pending">⏳</div>
          <div>
            <h3>{pendingCount}</h3>
            <p>Pending Review</p>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon progress">⚡</div>
          <div>
            <h3>{inProgressCount}</h3>
            <p>Field Crews Active</p>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon resolved">✅</div>
          <div>
            <h3>{resolvedCount}</h3>
            <p>Successfully Resolved</p>
          </div>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="workspace-grid">
        
        {/* Left Pane: Submission Form */}
        <div className="glass-panel form-panel">
          <h2>📝 Dispatch New Ticket</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Citizen Full Name</label>
              <input type="text" name="citizenName" placeholder="e.g. Sarah Jenkins" value={formData.citizenName} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Contact Email</label>
              <input type="email" name="email" placeholder="sarah@example.com" value={formData.email} onChange={handleChange} required />
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
              <input type="text" name="address" placeholder="104 Sector 4, Main Avenue" value={formData.address} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Detailed Observations</label>
              <textarea name="description" placeholder="Describe leak intensity, color, or duration..." value={formData.description} onChange={handleChange} required />
            </div>

            <button type="submit" className="glass-submit-btn">Broadcast Report 🚀</button>
          </form>
        </div>

        {/* Right Pane: Live Incident Feed & Search */}
        <div className="glass-panel feed-panel">
          <div className="feed-top-bar">
            <h2>📡 Active Incident Streams</h2>
            <input 
              type="text" 
              className="search-bar" 
              placeholder="Search complaints by name, address..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Pill Tabs */}
          <div className="filter-pills">
            {['ALL', 'Pipeline Leakage', 'No Water Supply', 'Contaminated Water', 'Low Pressure'].map(cat => (
              <button
                key={cat}
                className={`pill-btn ${filterCategory === cat ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Feed List */}
          <div className="tickets-scroll-container">
            {filteredComplaints.length === 0 ? (
              <div className="empty-feed">
                <p>No active incidents found matching your criteria.</p>
              </div>
            ) : (
              filteredComplaints.map((c) => (
                <div key={c.id} className="ticket-card">
                  <div className="ticket-header-row">
                    <span className="ticket-tag">TICKET #{c.id}</span>
                   <span className={`status-pill ${c.status ? c.status.toLowerCase() : 'pending'}`}>{c.status || 'PENDING'}</span>
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
                      <label>State:</label>
                      <select value={c.status} onChange={(e) => updateStatus(c.id, e.target.value)}>
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