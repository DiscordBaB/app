import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/appeals';
import { useAuth } from '../contexts/AuthContext';

export const DiscordCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Discord OAuth error:', error);
      navigate('/login');
      return;
    }

    if (code) {
      authAPI
        .handleDiscordCallback(code)
        .then((res) => {
          localStorage.setItem('authToken', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          setUser(res.data.user);
          navigate('/dashboard');
        })
        .catch((err) => {
          console.error('Auth callback failed:', err);
          navigate('/login');
        });
    }
  }, [searchParams, navigate, setUser]);

  return (
    <div className="min-h-screen bg-discord-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Completing authentication...</p>
      </div>
    </div>
  );
};
