// Suggestions.jsx
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import './Suggestions.css'; // Create a new CSS file for styling if needed

const Suggestions = () => {
  // State for managing the suggestion input and prompt visibility
  const [suggestion, setSuggestion] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);

  // Function to handle the form submission and store the suggestion in Firestore
  const handleSubmit = async () => {
    try {
      // Get a reference to the "suggestions" collection in Firestore
      const suggestionsCollection = collection(db, 'suggestions');

      // Add a new document with the suggestion text and a timestamp
      await addDoc(suggestionsCollection, {
        suggestion: suggestion,
        read: 'Read',
        timestamp: new Date(),
      });

      console.log('Suggestion submitted:', suggestion);

      // Clear the input field after submission
      setSuggestion('');

      // Show the prompt
      setShowPrompt(true);

      // Hide the prompt after a few seconds (adjust as needed)
      setTimeout(() => {
        setShowPrompt(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting suggestion:', error);
    }
  };

  return (
    <div className="suggestions-container">
        <h1>Got any suggestions? Let us know</h1>
      <div className="suggestions-form-container">
        <textarea
          placeholder="Type your suggestion here..."
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
        />
        <button className="suggestions-submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
      {showPrompt && (
        <div className="suggestions-prompt">
          Suggestion submitted. Thank you for your feedback!
        </div>
      )}
    </div>
  );
};

export default Suggestions;