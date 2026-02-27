'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    console.log('ProtectedRoute check:', { isLoading, isAuthenticated, pathname, user });
    
    if (!isLoading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to login...');
      setIsRedirecting(true);
      
      // Store the current path so we can redirect back after login
      const currentPath = pathname + (typeof window !== 'undefined' ? window.location.search : '');
      if (typeof window !== 'undefined') {
        localStorage.setItem('dormigo_redirect_after_login', currentPath);
      }
      
      // Small delay for smooth transition
      const timer = setTimeout(() => {
        router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, router, redirectTo, pathname, user]);

  // Show loading spinner while checking authentication or redirecting
  if (isLoading || isRedirecting) {
    return showLoader ? (
      <div className="min-h-screen flex items-center justify-center bg-white animate-fade-in">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <div className="w-6 h-6 bg-white rounded-full"></div>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            {isRedirecting ? 'Redirecting to login...' : 'Loading...'}
          </p>
        </div>
      </div>
    ) : null;
  }

  // If not authenticated, return null (redirect is handled in useEffect)
  if (!isAuthenticated) {
    console.log('Rendering null - not authenticated');
    return null;
  }

  // If authenticated, render the protected content with fade-in
  console.log('Rendering protected content - user is authenticated');
  return <div className="animate-fade-in">{children}</div>;
};

export default ProtectedRoute;