import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { UserProfile } from '@/types/youtube';

export const useYouTubeAuth = () => {
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('access_token');
    const errorParam = searchParams.get('error');
    
    if (errorParam) {
      setError(errorParam);
      return;
    }
    
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);
    }
  }, [searchParams]);

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/youtube?action=auth');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get auth URL');
      }
      
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('Error initiating YouTube auth:', error);
      setError('Failed to start authentication');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    setAccessToken(null);
    setError(null);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  return {
    isAuthenticated,
    userProfile,
    setUserProfile,
    accessToken,
    error,
    setError,
    handleLogin,
    handleLogout,
  };
}; 