'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import RoleGuard from '../../components/RoleGuard'; // Using strict relative path to prevent alias errors

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    capacity: '',
    price: '' // Price state initialized
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        capacity: parseInt(formData.capacity, 10),
        price: formData.price ? parseInt(formData.price) : 0, 
        date: new Date(formData.date).toISOString(),
      };

      await api.post('/events', payload);
      alert('Event created successfully!');
      router.push('/dashboard'); 
    } catch (error) {
      if (error instanceof Error) {
        alert(`Failed to create event: ${error.message}`);
      } else {
        alert('Failed to create event: An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleGuard requiredRole="CREATOR">
      <div className="max-w-2xl mx-auto mt-10">
        <h1 className="text-3xl font-extrabold mb-8">Create New Event</h1>
        
        <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl flex flex-col gap-6">
          
          {/* Title */}
          <div>
            <label className="text-sm text-gray-400">Event Title</label>
            <input 
              type="text" required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full mt-2 p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-400">Description</label>
            <textarea 
              required rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full mt-2 p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
          </div>

          {/* 3-Column Grid: Date, Capacity, and Price */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400">Date & Time</label>
              <input 
                type="datetime-local" required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full mt-2 p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-400">Capacity</label>
              <input 
                type="number" required min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full mt-2 p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Price (₦)</label>
              <input 
                type="number" min="0" step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0 for free"
                className="w-full mt-2 p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm text-gray-400">Location</label>
            <input 
              type="text" required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full mt-2 p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
          </div>

          {/* Submit Button */}
          <button 
            disabled={loading}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 py-3 rounded-lg font-bold transition-all"
          >
            {loading ? 'Creating...' : 'Publish Event'}
          </button>
        </form>
      </div>
    </RoleGuard>
  );
}