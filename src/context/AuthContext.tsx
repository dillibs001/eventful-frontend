'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Tell TypeScript what a "User" looks like
type User = { role: string } | null;

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // 2. Pass that type into useState
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) setUser({ role });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);