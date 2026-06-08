'use client';
import { useState } from 'react';

export default function RegistrationForm({ eventId }: { eventId: string }) {
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/tickets/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, userId, userEmail: email }),
    });

    if (res.ok) alert('Registration Successful!');
    else alert('Registration Failed.');
  };

  return (
    <form onSubmit={handleRegister} className="p-4 bg-gray-900 rounded-lg text-white">
      <input className="block w-full p-2 mb-2 text-black" placeholder="User ID" onChange={(e) => setUserId(e.target.value)} />
      <input className="block w-full p-2 mb-2 text-black" placeholder="Email" type="email" onChange={(e) => setEmail(e.target.value)} />
      <button className="w-full bg-blue-600 p-2 rounded">Register for Event</button>
    </form>
  );
}