'use client';

import { useState } from 'react';

export default function Home() {
  const [eventId, setEventId] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // ⚠️ Point this to your local NestJS backend port
      const response = await fetch('http://localhost:3000/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, userId, userEmail: email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`🎉 Success! Ticket ID: ${data.ticketId}`);
      } else {
        setMessage(`❌ Error: ${data.message || 'Registration failed'}`);
      }
    } catch (error) {
      setMessage('❌ Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Event Registration</h1>
        <p className="text-sm text-slate-400 mb-6">Enter your details to reserve a ticket and receive your QR code.</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Event ID</label>
            <input 
              type="text" 
              required
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Paste event UUID"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">User ID</label>
            <input 
              type="text" 
              required
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Paste user ID"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="doctor@example.com"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 font-medium text-sm py-3 rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
          >
            {loading ? 'Processing Registration...' : 'Register for Event'}
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 rounded-lg bg-slate-950 border border-slate-800 text-sm text-center font-medium animate-fade-in">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}