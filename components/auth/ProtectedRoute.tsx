'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  showLoader?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login',
  showLoader = true 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the current path so we can redirect back after login
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem('dormigo_redirect_after_login', currentPath);
      
      // Redirect to login page
      router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return showLoader ? (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    ) : null;
  }

  // If not authenticated, return null (redirect is handled in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;