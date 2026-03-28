import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Get the list of users we saved during Registration
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');

    // 2. Try to find a user that matches the email AND password
    const user = savedUsers.find(
      (u: any) => u.email === email && u.password === password
    );

    if (user) {
      // 3. Mock "Session": Store the logged-in user's name
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // 4. Redirect to the Company Profile to complete setup
      navigate('/company-profile');
    } else {
      setError('Invalid email or password. Did you register yet?');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: '#333' }}>Login to ComplianceApp</h2>
        {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
        
        <form onSubmit={handleLogin}>
          <div style={inputGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={inputStyle}
            />
          </div>

          <div style={inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={inputStyle}
            />
          </div>

          <button type="submit" style={btnStyle}>Sign In</button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '14px' }}>
          New here? <Link to="/register" style={{ color: '#007bff' }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}

// Minimalist Styles
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6' };
const cardStyle = { backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' as const };
const inputGroup = { marginBottom: '1rem', textAlign: 'left' as const };
const inputStyle = { width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #ddd' };
const btnStyle = { width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' as const };


