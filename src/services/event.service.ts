const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const EventService = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/events`);
    return res.json();
  },
  // You'll need this for the dashboard
  getAnalytics: async (token: string) => {
    const res = await fetch(`${API_URL}/events/analytics/dashboard`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  }
};