'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { CalendarDays, LogOut, LayoutDashboard, PlusCircle } from 'lucide-react';

export default function Navbar() {
  const { user, setUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Don't show the navbar on the login page
  if (pathname === '/login') return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-black/50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <CalendarDays className="text-indigo-500" size={28} />
            <span className="text-xl font-bold tracking-tight text-white">Eventful</span>
          </Link>

          {/* Dynamic Links */}
          <div className="flex items-center gap-6">
            {!user ? (
              <Link href="/login" className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition">
                Sign In
              </Link>
            ) : (
              <>
                <Link href="/" className={`text-sm font-medium transition ${pathname === '/' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                  Discover
                </Link>

                {/* CREATOR ONLY LINKS */}
                {user.role === 'CREATOR' && (
                  <>
                    <Link href="/dashboard" className={`flex items-center gap-1 text-sm font-medium transition ${pathname === '/dashboard' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link href="/events/create" className={`flex items-center gap-1 text-sm font-medium transition ${pathname === '/events/create' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                      <PlusCircle size={16} /> Create
                    </Link>
                  </>
                )}

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm font-medium text-red-400 hover:text-red-300 transition ml-4"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}