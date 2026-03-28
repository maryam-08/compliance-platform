import React, { useState } from 'react';
// Change 'react-router-dom' to 'react-router' for v7 framework
import { useNavigate, Link } from 'react-router'; 

export default function Register() {
  // 1. We define the structure of our data so TS doesn't guess
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: ''
  });
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // 2. This is the fix for the "e.target.name" error
    // We tell TS that 'name' is definitely one of the keys in our formData
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser = { 
      id: Date.now(), 
      ...formData 
    };
    
    localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));
    navigate('/'); 
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} required style={inputStyle} /><br/>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required style={inputStyle} /><br/>
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={inputStyle} /><br/>
        <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required style={inputStyle} /><br/>
        <input name="companyName" placeholder="Company Name" onChange={handleChange} required style={inputStyle} /><br/>
        <button type="submit" style={{ marginTop: '1rem', width: '100%', padding: '0.5rem' }}>Register</button>
      </form>
      <p style={{ textAlign: 'center' }}>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

// Simple style object to keep the form clean
const inputStyle = {
  width: '100%',
  padding: '8px',
  marginBottom: '10px',
  boxSizing: 'border-box' as const
};