import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faPaperPlane, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import './Card.css'; 
import './AIAdvisorCard.css'; 

const AIAdvisorCard = () => {
  const [response, setResponse] = useState('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(true);

  // Function to call our new POST route
  const fetchAIResponse = async (userQuestion) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Call your backend POST route
      const res = await axios.post('https://financeflow-backend-ao63.onrender.com/advisor', 
        { question: userQuestion },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setResponse(res.data.tip);
      setQuestion(''); // Clear the input field after sending
    } catch (error) {
      setResponse("Could not load AI advice right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch an initial tip when the dashboard loads automatically
  useEffect(() => {
    fetchAIResponse("Give me a brief overview or one tip about my spending so far.");
  },[]);

  // Handle user submitting a custom question
  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      fetchAIResponse(question);
    }
  };

  return (
    <div className="card ai-advisor-card">
      <div className="ai-header">
        <FontAwesomeIcon icon={faRobot} className="ai-icon" />
        <h3 style={{ margin: 0, fontWeight: 'bold', fontSize: '22px' }}>AI Financial Advisor</h3>
      </div>
      
      <div className="ai-content">
        {loading ? (
          <p className="ai-loading-text">
            <span>AI is analyzing your finances...</span>
          </p>
        ) : (
          <p className="ai-tip-text">
            <FontAwesomeIcon icon={faLightbulb} style={{ color: '#f1c40f', marginRight: '8px' }} />
            {response}
          </p>
        )}
      </div>

      {/* NEW: Input form to ask questions */}
      <form onSubmit={handleSubmit} className="ai-input-form">
        <input 
          type="text" 
          value={question} 
          onChange={(e) => setQuestion(e.target.value)} 
          placeholder="Ask a question about your budget or spending..." 
          className="ai-input"
          disabled={loading}
        />
        <button type="submit" className="ai-submit-btn" disabled={loading || !question.trim()}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </div>
  );
};

export default AIAdvisorCard;