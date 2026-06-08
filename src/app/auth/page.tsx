'use client';
import { useState } from 'react';
import { AuthService } from '../../services/auth.service';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', role: 'EVENTEE' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = isLogin 
      ? await AuthService.login(formData) 
      : await AuthService.register(formData);
      
    alert(result.message || "Success!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <form onSubmit={handleSubmit} className="p-8 bg-gray-900 border border-gray-800 rounded-2xl w-96 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6">{isLogin ? 'Login' : 'Create Account'}</h2>
        
        <input className="w-full p-3 mb-4 bg-gray-800 rounded" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
        <input className="w-full p-3 mb-4 bg-gray-800 rounded" type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} />
        
        {!isLogin && (
          <select className="w-full p-3 mb-4 bg-gray-800 rounded" onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="EVENTEE">Eventee</option>
            <option value="CREATOR">Creator</option>
          </select>
        )}

        <button className="w-full bg-indigo-600 p-3 rounded font-bold hover:bg-indigo-500">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
        
        <p className="mt-4 text-center cursor-pointer text-sm text-gray-400" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </p>
      </form>
    </div>
  );
}