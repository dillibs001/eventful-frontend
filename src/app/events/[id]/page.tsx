'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext'; 
import { api } from '../../../lib/api';

interface TicketPurchaseRequest {
  eventId: string;
}

interface EventDetails {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  capacity: number;
  price: number;
  creatorId: string;
}


interface PaystackResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (!id) return;

    api.get<EventDetails>(`/events/${id}`)
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching event details:", err);
        setLoading(false);
      });
  }, [id]);

const handleCheckout = async () => {
  if (!user) {
    alert('You must be logged in to secure a ticket.');
    router.push('/login');
    return;
  }

  setCheckingOut(true);

  try {
    if (Number(event?.price) === 0) {
      // Free Flow: Existing attendance logic
      await api.post(`/events/${id}/attend`, {});
      alert('Registration successful! Your free ticket has been sent to your email.');
      router.push('/dashboard');
    } else {
      // PAID FLOW: Backend-Engine Redirect
      // 1. Ask the backend to initialize the payment
      const response = await api.post<TicketPurchaseRequest, PaystackResponse>(`/tickets/purchase`, { 
        eventId: id as string
      });

      // 2. The backend returns the Paystack URL; redirect the user there
      if (response.authorization_url) {
        window.location.href = response.authorization_url;
      } else {
        throw new Error("Payment initialization failed: No URL returned.");
      }
    }
  } catch (error) {
    console.error("Checkout error:", error);
    alert(error instanceof Error ? error.message : 'Checkout failed.');
    setCheckingOut(false);
  }
  // No finally block needed here because we are redirecting away from this page!
};
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-gray-400 animate-pulse text-lg">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-red-400 font-bold">Event not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 text-white">
      <button 
        onClick={() => router.push('/')}
        className="mb-6 text-sm text-gray-400 hover:text-white transition-all"
      >
        ← Back to Discover
      </button>

      <div className="glass p-8 rounded-3xl border border-gray-800 bg-gray-900/40 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">{event.title}</h1>
            <p className="text-indigo-400 font-medium mt-2">
              📍 {event.location} • 📅 {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="bg-gray-800/80 px-6 py-3 rounded-2xl text-center border border-gray-700 min-w-35">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Ticket Price</p>
            <p className="text-2xl font-black text-white mt-1">
              {Number(event.price) === 0 ? 'FREE' : `₦${Number(event.price).toLocaleString()}`}
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-300">About This Event</h3>
            <p className="text-gray-400 mt-2 leading-relaxed text-base whitespace-pre-line">
              {event.description}
            </p>
          </div>

          <div className="flex items-center gap-6 bg-white/5 p-4 rounded-xl border border-gray-800 text-sm text-gray-400 w-fit">
            <span>🎟️ <strong>Capacity:</strong> {event.capacity} seats available</span>
          </div>

          <button
            disabled={checkingOut}
            onClick={handleCheckout}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 py-4 rounded-xl font-bold text-lg tracking-wide transition-all shadow-xl"
          >
            {checkingOut ? 'Processing Checkout...' : event.price === 0 ? 'Claim Free Ticket' : 'Proceed to Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}