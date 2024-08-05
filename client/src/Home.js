import React from 'react';
import './MyQuotes.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="my-quotes-container">
      <div className="header" style={{ marginBottom: '20px' }}>
        <h1 className="title">Amitron Quoting: My Quotes</h1>
        <button className="new-quote-button" onClick={() => navigate('/newQuote')}>
          New Quote
        </button>
      </div>
      <div className="under-construction">
        <h2>This Page is currently under construction</h2>
        <p>Please check back later for updates.</p>
      </div>
    </div>
  );
}

export default Home;
