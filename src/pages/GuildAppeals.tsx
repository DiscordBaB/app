import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { appealsAPI, guildsAPI, Appeal, Guild } from '../services/appeals';
import { AlertCircle, ChevronRight, Loader } from 'lucide-react';

export const GuildAppeals = () => {
  const { guildId } = useParams();
  const [guild, setGuild] = useState<Guild | null>(null);
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'denied'>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (guildId) {
          const [guildRes, appealsRes] = await Promise.all([
            guildsAPI.getGuild(guildId),
            appealsAPI.getGuildAppeals(guildId),
          ]);
          setGuild(guildRes.data);
          setAppeals(appealsRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [guildId]);

  const filteredAppeals = filter === 'all' ? appeals : appeals.filter((a) => a.status === filter);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
      approved: 'bg-green-500/20 text-green-200 border-green-500/30',
      denied: 'bg-red-500/20 text-red-200 border-red-500/30',
    };
    return styles[status] || styles.pending;
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      pending: '⏳',
      approved: '✅',
      denied: '❌',
    };
    return icons[status] || '❓';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (!guild) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <p className="text-gray-400">Guild not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        {guild.icon && (
          <img
            src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
            alt={guild.name}
            className="w-16 h-16 rounded-full border-2 border-discord-700"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-white">{guild.name}</h1>
          <p className="text-gray-400">Manage appeals for this server</p>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-4 gap-4">
        {['all', 'pending', 'approved', 'denied'].map((status) => {
          const count =
            status === 'all'
              ? appeals.length
              : appeals.filter((a) => a.status === status).length;
          return (
            <div
              key={status}
              className="bg-discord-800 rounded-lg border border-discord-700 p-4"
            >
              <div className="text-2xl mb-2">
                {status === 'all' && '📋'}
                {status === 'pending' && '⏳'}
                {status === 'approved' && '✅'}
                {status === 'denied' && '❌'}
              </div>
              <p className="text-gray-400 text-sm capitalize">{status}</p>
              <p className="text-2xl font-bold text-white">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-discord-700 pb-4">
        {['all', 'pending', 'approved', 'denied'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg font-semibold capitalize transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-discord-800 text-gray-400 hover:text-white'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Appeals List */}
      <div className="space-y-3">
        {filteredAppeals.length === 0 ? (
          <div className="text-center py-12 bg-discord-800 rounded-lg border border-discord-700">
            <p className="text-gray-400">No appeals found</p>
          </div>
        ) : (
          filteredAppeals.map((appeal) => (
            <Link
              key={appeal.id}
              to={`/appeal/${appeal.id}`}
              className="block bg-discord-800 rounded-lg border border-discord-700 p-4 hover:border-blue-500 transition-colors hover:bg-discord-700/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{getStatusIcon(appeal.status)}</span>
                    <h3 className="font-semibold text-white">{appeal.userDiscordTag || appeal.userId}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border capitalize font-semibold ${getStatusBadge(appeal.status)}`}
                    >
                      {appeal.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2">{appeal.reason}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    {new Date(appeal.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <ChevronRight className="text-gray-500" size={20} />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};
