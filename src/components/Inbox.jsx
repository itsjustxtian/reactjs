import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../config/firebase-config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const Inbox = () => {
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = useCallback(async () => {
    try {
      const suggestionsCollection = collection(db, 'suggestions');
      const snapshot = await getDocs(suggestionsCollection);

      const suggestionData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Sort suggestions based on timestamp in descending order (most recent first)
      const sortedSuggestions = suggestionData.sort((a, b) => b.timestamp - a.timestamp);

      setSuggestions(sortedSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const handleSuggestionClick = async (id) => {
    try {
      const suggestionRef = doc(db, 'suggestions', id);

      // Get the current "read" field value
      const suggestionDoc = await getDocs(suggestionRef);
      const currentReadValue = suggestionDoc.data().read;

      // If the suggestion is unread, update the "read" field to true
      if (!currentReadValue) {
        await updateDoc(suggestionRef, { read: true });
      }

      // Fetch the updated suggestions and update the state
      fetchSuggestions();
    } catch (error) {
      console.error('Error updating suggestion:', error);
    }
  };

  return (
    <div className='inbox-container'>
      <div className='list-of-suggestions'>
        <div className='component-name'>
          <h1>Inbox</h1>
        </div>

        {suggestions.map((suggestion, index) => (
          <div className='suggestion-message' key={index} onClick={() => handleSuggestionClick(suggestion.id)}>
            <label style={{ fontWeight: suggestion.read ? 'bold' : 'normal' }}>
              {suggestion.suggestion}
            </label>
            <button>Mark as Read</button>
          </div>
        ))}
      </div>

      <div className='viewed-message'>
        Viewed Message part
      </div>
    </div>
  );
};

export default Inbox;
