
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
 // const [answers, setAnswers] = useState<Record<number, string>>({});
const [answers, setAnswers] = useState<Record<number, { val: string, evidenceName?: string }>>({});
  /*useEffect(() => {
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
  }, [navigate]);*/

// 2. Updated useEffect with a "Cleaner" to prevent crashes from old data
useEffect(() => {
  const profile = JSON.parse(localStorage.getItem('companyProfile') || '{}');
  if (!profile.sector) {
    navigate('/company-profile');
    return;
  }

  const filtered = QUESTION_BANK.filter(q => 
    q.targetSector.includes('ALL') || q.targetSector.includes(profile.sector)
  );
  setRelevantQuestions(filtered);

  const rawSaved = localStorage.getItem('currentAudit');
  if (rawSaved) {
    const parsed = JSON.parse(rawSaved);
    
    // MIGRATION: If the first item is a string, the data is old. Clear it!
    const firstKey = Object.keys(parsed)[0];
    if (firstKey && typeof parsed[firstKey] === 'string') {
      console.warn("Old data format detected. Resetting audit for new schema.");
      localStorage.removeItem('currentAudit');
      setAnswers({});
    } else {
      setAnswers(parsed);
    }
  }
}, [navigate]);

  // 2. Updated handler to manage file selection
const handleFileUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const updated = { 
      ...answers, 
      [id]: { ...answers[id], evidenceName: file.name } 
    };
    setAnswers(updated);
    localStorage.setItem('currentAudit', JSON.stringify(updated));
  }
};

const handleAnswerChange = (id: number, val: string) => {
  const updated = { 
    ...answers, 
    [id]: { ...answers[id], val: val } 
  };
  setAnswers(updated);
  localStorage.setItem('currentAudit', JSON.stringify(updated));
};
     //const handleAnswerChange = (id: number, val: string) => {
   // const updated = { ...answers, [id]: val };
   // setAnswers(updated);
    //localStorage.setItem('currentAudit', JSON.stringify(updated));
  //};

 /* const calculateProgress = () => {
    if (relevantQuestions.length === 0) return 0;
    const answeredCount = relevantQuestions.filter(q => answers[q.id]).length;
    return Math.round((answeredCount / relevantQuestions.length) * 100);
  };*/
  // 1. Updated Progress Logic: Only counts if a choice (Yes/No/NA) is made
const calculateProgress = () => {
  if (relevantQuestions.length === 0) return 0;
  // Check specifically for the .val property
  const answeredCount = relevantQuestions.filter(q => answers[q.id]?.val).length;
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
    
    <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
      {['YES', 'NO', 'NA'].map(option => (
        <label key={option}>
          <input 
            type="radio" 
            name={`q-${q.id}`} 
            checked={answers[q.id]?.val === option} 
            onChange={() => handleAnswerChange(q.id, option)} 
          /> {option}
        </label>
      ))}
    </div>

    {/* Evidence Upload Section */}
    <div style={evidenceBox}>
      <label style={{ fontSize: '12px', cursor: 'pointer', color: '#007bff' }}>
        📎 {answers[q.id]?.evidenceName ? 'Change Evidence' : 'Attach Evidence'}
        <input 
          type="file" 
          hidden 
          onChange={(e) => handleFileUpload(q.id, e)} 
        />
      </label>
      {answers[q.id]?.evidenceName && (
        <span style={fileNameStyle}>Selected: {answers[q.id].evidenceName}</span>
      )}
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
const evidenceBox = { 
  marginTop: '10px', 
  padding: '10px', 
  backgroundColor: '#f8f9fa', 
  borderRadius: '4px', 
  border: '1px dashed #ccc' 
};
const fileNameStyle = { 
  marginLeft: '10px', 
  fontSize: '12px', 
  color: '#28a745', 
  fontWeight: 'bold' 
};