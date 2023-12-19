import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = ({ handleClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCancel = () => {
    handleClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add the logic to send a password reset email
    try {
      // Implement the password reset logic based on your authentication service
      // For example, using Firebase Auth:
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);

      setMessage(`Password reset email sent to ${email}`);
      setError('');

      setTimeout(() => {
        handleCancel();
      }, 2000);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setError('Error sending password reset email. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className='forgotpasswordcomponent'>
      <div className='component-title'>Forgot Password</div>
      <div className='forda-all'>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button onClick={handleSubmit} id='submit'>Reset Password</button>
        <button id="cancel" onClick={handleCancel}>
            Cancel
        </button>
      </div>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      
    </div>
  );
};

export default ForgotPassword;
