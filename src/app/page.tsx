'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

interface EventItem {
  id: string;
  eventId?: string;
  title: string; 
  description: string;
  location: string;
  date: string;
  capacity: number;
  price: number; // 1. Added price property to match Prisma schema
  creatorId: string;
}

interface TicketPurchasePayload {
  eventId: string;
}

interface TicketResponse {
  id: string;
  eventId: string;
  userId: string;
  createdAt: string;
}

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  // Fetch data using our centralized API client
  useEffect(() => {
    api.get<EventItem[]>('/events')
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  // Handle automatic registration via JWT session identity
  const handleRegister = async (eventId?: string) => {
    if (!user) {
      alert('You must be logged in to register for an event.');
      router.push('/login');
      return;
    }

    try {
      await api.post(`/events/${eventId}/attend`, {});
      alert('Successfully registered for this event! Check your email for the QR Code.');
    } catch (err: any) {
      const errorMessage = Array.isArray(err.message) ? err.message[0] : err.message;
      alert(`Registration failed: ${errorMessage}`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-400 animate-pulse">Loading events...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen text-white">
      {/* Header Section with Role-Based Action Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Discover Events</h1>
          <p className="text-gray-400 mt-1">Reserve your spot at the best tech gatherings.</p>
        </div>

        {user?.role === 'CREATOR' && (
          <button 
            onClick={() => router.push('/events/create')}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
          >
            Create New Event
          </button>
        )}
      </div>
      
      {/* Events Display Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-12 glass rounded-2xl">
            <p className="text-gray-400">No events found. Check back later!</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="glass p-6 rounded-2xl flex flex-col justify-between border border-gray-800 shadow-xl bg-gray-900/50 backdrop-blur-md">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">{event.title}</h2>
                <p className="text-gray-400 text-sm mt-1">{event.location} • {new Date(event.date).toLocaleDateString()}</p>
                <p className="text-gray-300 mt-4 line-clamp-3 text-sm leading-relaxed">{event.description}</p>
              </div>

              {/* 2. Updated Card Footer with Stacked Capacity and Price rendering */}
              <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-gray-500 font-medium">Capacity: {event.capacity} seats</span>
                  <span className="text-sm font-bold text-indigo-400">
                    {Number(event.price) === 0 ? 'Free' : `₦${Number(event.price).toLocaleString()}`}
                  </span>
                </div>
              <button 
  onClick={() => router.push(`/events/${event.id}`)}                  
  className="bg-white/10 hover:bg-white text-white hover:text-black px-4 py-2 rounded-lg text-sm font-semibold transition-all"
>
  View Details
</button>
              </div>

            </div>
          ))
        )}
      </div>
    </main>
  );
}