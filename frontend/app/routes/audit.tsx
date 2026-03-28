
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

// 1. Define what a Question looks like
interface Question {
  id: number;
  text: string;
  category: string;
  targetSector: string[]; // Which sectors see this? ['ALL'] or ['IT', 'HEALTH']
}

// 2. The "Database" of Questions
const QUESTION_BANK: Question[] = [
  { id: 1, text: "Do you have a formal Information Security Policy?", category: "Governance", targetSector: ['ALL'] },
  { id: 2, text: "Is multi-factor authentication (MFA) required for all employees?", category: "Access Control", targetSector: ['IT'] },
  { id: 3, text: "Are medical records encrypted at rest and in transit?", category: "Data Privacy", targetSector: ['HEALTH'] },
  { id: 4, text: "Do you perform regular pressure vessel inspections?", category: "Safety", targetSector: ['IND'] },
  { id: 5, text: "Do you have a process for reporting security incidents?", category: "Incident Response", targetSector: ['ALL'] },
];

export default function Audit() {
  const navigate = useNavigate();
  const [relevantQuestions, setRelevantQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    // Load company profile to filter questions
    const profile = JSON.parse(localStorage.getItem('companyProfile') || '{}');
    if (!profile.sector) {
      alert("Please complete your company profile first!");
      navigate('/company-profile');
      return;
    }

    // THE RULE ENGINE: Filter questions based on the sector
    const filtered = QUESTION_BANK.filter(q => 
      q.targetSector.includes('ALL') || q.targetSector.includes(profile.sector)
    );
    setRelevantQuestions(filtered);

    // Load existing answers if they exist
    const savedAnswers = JSON.parse(localStorage.getItem('currentAudit') || '{}');
    setAnswers(savedAnswers);
  }, [navigate]);

  const handleAnswerChange = (id: number, val: string) => {
    const updated = { ...answers, [id]: val };
    setAnswers(updated);
    localStorage.setItem('currentAudit', JSON.stringify(updated));
  };

  const calculateProgress = () => {
    if (relevantQuestions.length === 0) return 0;
    const answeredCount = relevantQuestions.filter(q => answers[q.id]).length;
    return Math.round((answeredCount / relevantQuestions.length) * 100);
  };

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <h3>Audit Progress</h3>
        <div style={progressBarBg}><div style={{...progressBarFill, width: `${calculateProgress()}%`}}></div></div>
        <p>{calculateProgress()}% Complete</p>
        <button onClick={() => navigate('/dashboard')} style={backBtn}>Back to Dashboard</button>
      </div>

      <div style={contentStyle}>
        <h2>Internal Compliance Audit</h2>
        <p>Answering for Sector: <strong>{JSON.parse(localStorage.getItem('companyProfile') || '{}').sector}</strong></p>

        {relevantQuestions.map((q, index) => (
          <div key={q.id} style={questionCard}>
            <p><strong>{index + 1}. {q.text}</strong></p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <label><input type="radio" name={`q-${q.id}`} checked={answers[q.id] === 'YES'} onChange={() => handleAnswerChange(q.id, 'YES')} /> Yes</label>
              <label><input type="radio" name={`q-${q.id}`} checked={answers[q.id] === 'NO'} onChange={() => handleAnswerChange(q.id, 'NO')} /> No</label>
              <label><input type="radio" name={`q-${q.id}`} checked={answers[q.id] === 'NA'} onChange={() => handleAnswerChange(q.id, 'NA')} /> N/A</label>
            </div>
          </div>
        ))}

        <button 
          style={submitBtn} 
          onClick={() => { alert("Audit Saved!"); navigate('/results'); }}
          disabled={calculateProgress() < 100}
        >
          View Final Report
        </button>
      </div>
    </div>
  );
}

// Styles
const containerStyle = { display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6', color: '#333' };
const sidebarStyle = { width: '250px', backgroundColor: 'white', padding: '20px', borderRight: '1px solid #ddd' };
const contentStyle = { flex: 1, padding: '40px', maxWidth: '800px' };
const questionCard = { backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
const progressBarBg = { width: '100%', height: '10px', backgroundColor: '#eee', borderRadius: '5px', overflow: 'hidden' };
const progressBarFill = { height: '100%', backgroundColor: '#28a745', transition: 'width 0.3s' };
const backBtn = { marginTop: '20px', width: '100%', padding: '8px', cursor: 'pointer' };
const submitBtn = { marginTop: '30px', padding: '15px 30px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' as const };