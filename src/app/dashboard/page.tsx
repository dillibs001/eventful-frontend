'use client';
import { useEffect, useState } from 'react';
import RoleGuard from '../components/RoleGuard';
import { api } from '../../lib/api';
import { Users, Ticket, Calendar, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalEvents: number;
  totalTicketsSold: number;
  upcomingEvents: number;
}

export default function DashboardPage() {
  // This is what TypeScript was missing! 
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Ensure this matches your actual backend route
        const data = await api.get<DashboardStats>('/analytics'); 
        setStats(data);
      } catch (error: any) {
        console.error("Failed to load dashboard data", error.message);
      }
    };
    fetchStats();
  }, []);

  return (
    <RoleGuard requiredRole="CREATOR">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Creator Dashboard</h1>
          <p className="text-gray-400">Here is what is happening with your events today.</p>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Events" 
            value={stats?.totalEvents ?? '-'} 
            icon={<Calendar className="text-blue-400" />} 
          />
          <StatCard 
            title="Tickets Sold" 
            value={stats?.totalTicketsSold ?? '-'} 
            icon={<Ticket className="text-emerald-400" />} 
          />
          <StatCard 
            title="Upcoming Events" 
            value={stats?.upcomingEvents ?? '-'} 
            icon={<TrendingUp className="text-purple-400" />} 
          />
        </div>

        {/* Replaced min-h-[300px] with min-h-75 */}
        <div className="glass p-8 rounded-2xl border border-gray-800 min-h-75 flex items-center justify-center">
          <p className="text-gray-500 flex items-center gap-2">
            <Users size={20} /> Event attendance charts will appear here.
          </p>
        </div>
      </div>
    </RoleGuard>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="glass p-6 rounded-2xl border border-gray-800 flex items-center gap-4">
      <div className="p-4 bg-gray-900 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
}