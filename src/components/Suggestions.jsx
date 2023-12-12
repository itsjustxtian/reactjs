// Suggestions.jsx

import React, { useState } from 'react';
import './Suggestions.css'; // Create a new CSS file for styling if needed

const Suggestions = () => {
  // State for managing the suggestion input
  const [suggestion, setSuggestion] = useState('');

  // Function to handle the form submission (you can integrate with a database here)
  const handleSubmit = () => {
    // Perform actions to submit the suggestion (e.g., send to a server or store in a database)
    console.log('Suggestion submitted:', suggestion);

    // Clear the input field after submission
    setSuggestion('');
  };

  return (
    <div className="suggestions-container">
      <div className="suggestions-header">
        <p className="bold-text">Got any suggestions? Let us know</p>
      </div>
      <div className="suggestions-form-container">
        <textarea
          className="suggestions-textarea"
          placeholder="Type your suggestion here..."
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
        />
        <button className="suggestions-submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Suggestions;
