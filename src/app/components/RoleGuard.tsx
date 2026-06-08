'use client';
import { useAuth } from '../../context/AuthContext';
import { ReactNode, useEffect, useState } from 'react';

export default function RoleGuard({ 
  children, 
  requiredRole 
}: { 
  children: ReactNode, 
  requiredRole: string 
}) {
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);

  // This prevents Next.js hydration errors when reading from localStorage
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // If there is no user, or their role doesn't match, hide the content
  if (!user || user.role !== requiredRole) {
    return null; 
  }

  return <>{children}</>;
}