import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getToken, getMeApi, clearToken } from '../../services/apiClient';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setStatus('unauthenticated');
      return;
    }

    // Verify token is valid with the backend
    getMeApi().then(result => {
      if (result.success) {
        setStatus('authenticated');
      } else {
        clearToken();
        setStatus('unauthenticated');
      }
    });
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-spa-bg">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
          <p className="text-sm text-spa-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
