import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/appeals';
import { LogIn } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleDiscordLogin = async () => {
    try {
      const response = await authAPI.getDiscordAuthUrl();
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Failed to get Discord auth URL:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-discord-950 via-discord-900 to-discord-800 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">⚖️</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">DBAB</h1>
          <p className="text-gray-400">Discord Ban Appeal Bot Dashboard</p>
        </div>

        <div className="bg-discord-800 rounded-lg border border-discord-700 p-8 shadow-2xl">
          <p className="text-gray-300 text-center mb-6">
            Manage your server's ban appeals and appeals directly from the dashboard.
          </p>

          <button
            onClick={handleDiscordLogin}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <LogIn size={20} />
            Login with Discord
          </button>

          <p className="text-gray-500 text-xs text-center mt-6">
            By logging in, you agree to our Terms of Service
          </p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-disco-800 rounded-lg p-4 border border-discord-700">
            <div className="text-2xl mb-2">📋</div>
            <p className="text-sm text-gray-300">Manage Appeals</p>
          </div>
          <div className="bg-discord-800 rounded-lg p-4 border border-discord-700">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm text-gray-300">View Statistics</p>
          </div>
          <div className="bg-discord-800 rounded-lg p-4 border border-discord-700">
            <div className="text-2xl mb-2">⚙️</div>
            <p className="text-sm text-gray-300">Server Settings</p>
          </div>
        </div>
      </div>
    </div>
  );
};
