import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { guildsAPI, Guild } from '../services/appeals';
import { useAuth } from '../contexts/AuthContext';
import { Loader, LogOut } from 'lucide-react';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        const res = await guildsAPI.getUserGuilds();
        setGuilds(res.data);
      } catch (error) {
        console.error('Failed to fetch guilds:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuilds();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-discord-950 via-discord-900 to-discord-800">
      {/* Navigation */}
      <nav className="bg-discord-900/50 backdrop-blur border-b border-discord-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white">
                ⚖️
              </div>
              <h1 className="text-xl font-bold text-white">DBAB Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <>
                  {user.avatar && (
                    <img
                      src={user.avatar}
                      alt={user.discordTag}
                      className="w-8 h-8 rounded-full border border-discord-700"
                    />
                  )}
                  <span className="text-sm text-gray-300">{user.discordTag}</span>
                </>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.discordTag}!</h2>
          <p className="text-gray-400">Select a server to manage its ban appeals</p>
        </div>

        {/* Guilds Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Loader className="animate-spin text-blue-500" size={40} />
          </div>
        ) : guilds.length === 0 ? (
          <div className="text-center bg-discord-800 rounded-lg border border-discord-700 py-12">
            <p className="text-gray-400 mb-4">You don't own any servers with the bot</p>
            <a
              href="https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=8&scope=bot"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-colors"
            >
              Invite the bot to your server
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guilds.map((guild) => (
              <Link
                key={guild.id}
                to={`/guild/${guild.id}/appeals`}
                className="group bg-discord-800 rounded-lg border border-discord-700 p-6 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20 hover:bg-discord-700/50"
              >
                <div className="flex items-start gap-4 mb-4">
                  {guild.icon && (
                    <img
                      src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                      alt={guild.name}
                      className="w-12 h-12 rounded-full border border-discord-600 group-hover:border-blue-500 transition-colors"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {guild.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono">{guild.id}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-discord-600">
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    View and manage appeals →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
