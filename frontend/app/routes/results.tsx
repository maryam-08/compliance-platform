import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export default function Results() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [stats, setStats] = useState({ yes: 0, no: 0, na: 0, total: 0 });

  useEffect(() => {
    const savedAnswers = JSON.parse(localStorage.getItem('currentAudit') || '{}');
    const profile = JSON.parse(localStorage.getItem('companyProfile') || '{}');
    
    // We need to know which questions were actually relevant to calculate the score
    const allAnswers = Object.values(savedAnswers);
    const total = allAnswers.length;
    
    if (total === 0) {
      navigate('/dashboard');
      return;
    }

    const yesCount = allAnswers.filter(a => a === 'YES').length;
    const noCount = allAnswers.filter(a => a === 'NO').length;
    const naCount = allAnswers.filter(a => a === 'NA').length;

    // SCORING LOGIC: N/A answers shouldn't penalize the user
    // Formula: (Yes / (Total - N/A)) * 100
    const divisor = total - naCount;
    const finalScore = divisor > 0 ? Math.round((yesCount / divisor) * 100) : 0;

    setScore(finalScore);
    setStats({ yes: yesCount, no: noCount, na: naCount, total });
  }, [navigate]);

  return (
    <div style={containerStyle}>
      <div style={resultCard}>
        <h2>Audit Results Summary</h2>
        <hr />
        
        <div style={scoreContainer}>
          <div style={scoreCircle}>
            <span style={{ fontSize: '48px', fontWeight: 'bold' }}>{score}%</span>
            <span style={{ fontSize: '14px' }}>Compliance Score</span>
          </div>
        </div>

        <div style={statsGrid}>
          <div style={statBox}><strong>Total Questions:</strong> {stats.total}</div>
          <div style={{...statBox, color: 'green'}}><strong>Compliant (Yes):</strong> {stats.yes}</div>
          <div style={{...statBox, color: 'red'}}><strong>Non-Compliant (No):</strong> {stats.no}</div>
          <div style={{...statBox, color: 'gray'}}><strong>Not Applicable:</strong> {stats.na}</div>
        </div>

        <div style={messageBox(score)}>
          {score === 100 ? "Excellent! You are fully compliant." : 
           score > 70 ? "Good progress, but there are a few gaps to close." : 
           "Action Required: Your compliance level is currently low."}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
          <button style={btnAction} onClick={() => window.print()}>Download PDF Report</button>
          <button style={btnSecondary} onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
        </div>
      </div>
    </div>
  );
}

// Corrected Styles and Logic
const messageBox = (score: number) => ({
  padding: '20px',
  textAlign: 'center' as const,
  fontWeight: 'bold' as const,
  borderRadius: '8px',
  backgroundColor: score > 70 ? '#d4edda' : '#f8d7da',
  color: score > 70 ? '#155724' : '#721c24',
});

const containerStyle = { padding: '40px', backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', color: '#333' };
const resultCard = { backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '600px' };
const scoreContainer = { display: 'flex', justifyContent: 'center', margin: '30px 0' };
const scoreCircle = { width: '180px', height: '180px', borderRadius: '50%', border: '8px solid #007bff', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', alignItems: 'center' };
const statsGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' };
const statBox = { padding: '10px', border: '1px solid #eee', borderRadius: '5px' };
const btnAction = { flex: 1, padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' as const };
const btnSecondary = { flex: 1, padding: '12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };