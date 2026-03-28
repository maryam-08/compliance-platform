import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

// 1. The Blueprint (Interface)
interface CompanyProfileData {
  companyName: string;
  country: string;
  sector: string;
  employeeCount: number | '';
  turnover: string;
  siteCount: number;
}

export default function CompanyProfile() {
  const navigate = useNavigate();
  
  // 2. Initial State
  const [profile, setProfile] = useState<CompanyProfileData>({
    companyName: '',
    country: 'Tunisia', 
    sector: '',
    employeeCount: '',
    turnover: '',
    siteCount: 1
  });

  // 3. Effect: Load data when the page opens
  useEffect(() => {
    const savedProfile = localStorage.getItem('companyProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser.companyName) {
        setProfile(prev => ({ ...prev, companyName: currentUser.companyName }));
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('companyProfile', JSON.stringify(profile));
    alert("Profile saved! You are ready for the assessment.");
    navigate('/dashboard'); 
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', color: '#333' }}>
          Company Profile
        </h2>
        
        <div style={inputGroup}>
          <label style={labelStyle}>Company Legal Name</label>
          <input name="companyName" value={profile.companyName} onChange={handleChange} required style={inputStyle} />
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}>Country of Operation</label>
          <input name="country" value={profile.country} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}>Industry Sector</label>
          <select name="sector" value={profile.sector} onChange={handleChange} required style={inputStyle}>
            <option value="">-- Select Sector --</option>
            <option value="IT">IT & Digital Services</option>
            <option value="IND">Manufacturing / Industrial</option>
            <option value="AGRI">Agriculture & Food</option>
            <option value="HEALTH">Healthcare</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ ...inputGroup, flex: 1 }}>
            <label style={labelStyle}>Number of Employees</label>
            <input name="employeeCount" type="number" value={profile.employeeCount} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={{ ...inputGroup, flex: 1 }}>
            <label style={labelStyle}>Number of Sites</label>
            <input name="siteCount" type="number" min="1" value={profile.siteCount} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}>Annual Turnover (Approx.)</label>
          <input name="turnover" placeholder="e.g., 1M TND" value={profile.turnover} onChange={handleChange} style={inputStyle} />
        </div>

        <button type="submit" style={saveBtnStyle}>Save Profile & Go to Dashboard</button>
      </form>
    </div>
  );
}

// Styles
const containerStyle = { padding: '40px', display: 'flex', justifyContent: 'center', backgroundColor: '#f9f9f9', minHeight: '100vh' };
const formStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px' };
const inputGroup = { marginBottom: '20px', display: 'flex', flexDirection: 'column' as const };
const inputStyle = { padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px', color: '#333' };
const saveBtnStyle = { padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' as const, fontSize: '16px' };
const labelStyle = { fontWeight: 'bold' as const, marginBottom: '5px', color: '#333', fontSize: '14px' };