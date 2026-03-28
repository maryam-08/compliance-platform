import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [companyInfo, setCompanyInfo] = useState<any>(null);

  useEffect(() => {
    // 1. Check if user is logged in
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!user.name) {
      navigate('/'); // Send back to login if no session found
      return;
    }
    setUserName(user.name);

    // 2. Load company profile
    const profile = JSON.parse(localStorage.getItem('companyProfile') || 'null');
    setCompanyInfo(profile);
  }, [navigate]);

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1>Welcome, {userName}!</h1>
        <button onClick={() => { localStorage.removeItem('currentUser'); navigate('/'); }} style={logoutBtn}>Logout</button>
      </header>

      <main style={mainStyle}>
        <section style={cardStyle}>
          <h3>Company Status</h3>
          {companyInfo ? (
            <div>
              <p><strong>Entity:</strong> {companyInfo.companyName}</p>
              <p><strong>Sector:</strong> {companyInfo.sector}</p>
              <p><strong>Sites:</strong> {companyInfo.siteCount}</p>
              <span style={badgeStyle}>Profile Complete</span>
            </div>
          ) : (
            <p style={{ color: 'orange' }}>Please complete your profile.</p>
          )}
        </section>

        <section style={cardStyle}>
          <h3>Compliance Audit</h3>
          <p>Ready to check your ISO 27001 or GDPR status?</p>
          <button 
            style={primaryBtn}
            disabled={!companyInfo}
            onClick={() => navigate('/audit')}
          >
            Start New Assessment
          </button>
        </section>
      </main>
    </div>
  );
}

// Styling
const containerStyle = { padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh', color: '#333' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' };
const mainStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' };
const cardStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };
const badgeStyle = { backgroundColor: '#d4edda', color: '#155724', padding: '5px 10px', borderRadius: '15px', fontSize: '12px' };
const primaryBtn = { width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' };
const logoutBtn = { padding: '5px 15px', cursor: 'pointer', background: 'none', border: '1px solid #ccc', borderRadius: '5px' };