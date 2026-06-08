'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 1. New state to track the role during registration
  const [selectedRole, setSelectedRole] = useState<'EVENTEE' | 'CREATOR'>('EVENTEE');
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      
      // 2. If logging in, send just credentials. If registering, include the role!
      const payload = isLogin 
        ? { email, password } 
        : { email, password, role: selectedRole };
      
      const data = await api.post<any, { access_token: string }>(endpoint, payload);
      const token = data.access_token;

      // Unpack the JWT to get the user's role
      const tokenPayloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(tokenPayloadBase64));
      const userRole = decodedPayload.role;

      // Save the token and role
      localStorage.setItem('token', token); 
      localStorage.setItem('role', userRole);
      setUser({ role: userRole });
      
      router.push('/');
    } catch (error) { 
      if (error instanceof Error) {
        alert(`${isLogin ? 'Login' : 'Registration'} failed: ${error.message}`);
      } else {
        alert('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md p-8 rounded-2xl glass border border-gray-800 shadow-2xl">
        <h2 className="text-3xl font-extrabold text-white mb-2">
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h2>
        <p className="text-gray-400 mb-8">
          {isLogin ? 'Enter your details to access your account.' : 'Join the platform to discover or host events.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {/* 3. Role Selector - Only visible when registering */}
          {!isLogin && (
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">I want to...</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('EVENTEE')}
                  className={`p-3 rounded-lg text-sm font-semibold transition-all border ${
                    selectedRole === 'EVENTEE' 
                    ? 'bg-indigo-600 border-indigo-500 text-white' 
                    : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  Attend Events
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('CREATOR')}
                  className={`p-3 rounded-lg text-sm font-semibold transition-all border ${
                    selectedRole === 'CREATOR' 
                    ? 'bg-indigo-600 border-indigo-500 text-white' 
                    : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  Host Events
                </button>
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white font-bold py-3 rounded-lg transition-all mt-4"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            {isLogin ? 'Register' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}