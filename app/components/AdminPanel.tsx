'use client';

import { useState, useEffect } from 'react';

interface PinData {
  pin: string;
  ts: string;
  ua: string;
  ip?: string;
  createdAt?: string;
}

interface AdminPanelProps {
  onBack: () => void;
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [data, setData] = useState<PinData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const res = await fetch('/api/get-pins');
      if (res.ok) {
        const pinsData = await res.json();
        setData(pinsData);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (err) {
      setError('Error fetching admin data.');
    } finally {
      setIsLoading(false);
    }
  };

  const exportCSV = (pinsData: PinData[]) => {
    if (!pinsData || !pinsData.length) {
      alert('No data to export');
      return;
    }

    try {
      const header = ['pin', 'timestamp', 'user_agent', 'ip', 'created_at'];
      const rows = pinsData.map(r => [
        escapeCSV(r.pin),
        r.ts || '',
        escapeCSV(r.ua || ''),
        r.ip || '',
        r.createdAt || ''
      ]);

      const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'kxguard_pins_export.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Export failed: ' + (error as Error).message);
    }
  };

  const escapeCSV = (s: string) => {
    return '"' + String(s || '').replace(/"/g, '""') + '"';
  };

  if (isLoading) {
    return (
      <>
        <h1>Admin — Loading...</h1>
        <p className="lead">Loading stored PINs...</p>
      </>
    );
  }

  return (
    <>
      <h1>Admin — Stored PINs</h1>
      <p className="lead">Entries stored on the server.</p>

      {error && (
        <div style={{ color: '#ffb4b4' }}>
          {error}
        </div>
      )}

      {!Array.isArray(data) || data.length === 0 ? (
        <div style={{ marginTop: '12px' }}>
          No stored entries.
        </div>
      ) : (
        <pre
          style={{
            maxHeight: '300px',
            overflow: 'auto',
            background: 'rgba(255,255,255,0.02)',
            padding: '12px',
            borderRadius: '8px'
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      )}

      <div className="row" style={{ marginTop: '14px' }}>
        <button onClick={() => exportCSV(data)}>
          Export CSV
        </button>
        <button onClick={loadAdminData}>
          Refresh
        </button>
      </div>

      <a
        onClick={onBack}
        style={{
          display: 'block',
          marginTop: '12px',
          cursor: 'pointer'
        }}
        className="admin-link"
      >
        Back to PIN entry
      </a>
    </>
  );
}
