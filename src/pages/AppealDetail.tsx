import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { appealsAPI, Appeal } from '../services/appeals';
import { AlertCircle, CheckCircle, XCircle, Loader } from 'lucide-react';

export const AppealDetail = () => {
  const { appealId } = useParams();
  const [appeal, setAppeal] = useState<Appeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchAppeal = async () => {
      try {
        if (appealId) {
          const res = await appealsAPI.getAppeal(appealId);
          setAppeal(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch appeal:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppeal();
  }, [appealId]);

  const handleUpdateStatus = async (status: 'approved' | 'denied') => {
    if (!appeal) return;

    setUpdating(true);
    try {
      await appealsAPI.updateAppealStatus(appeal.id, status, response);
      setAppeal({ ...appeal, status });
      setResponse('');
    } catch (error) {
      console.error('Failed to update appeal:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (!appeal) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <p className="text-gray-400">Appeal not found</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30';
      case 'approved':
        return 'bg-green-500/20 text-green-200 border-green-500/30';
      case 'denied':
        return 'bg-red-500/20 text-red-200 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-200 border-gray-500/30';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-discord-800 rounded-lg border border-discord-700 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">Appeal Details</h1>
            <span className={`px-4 py-2 rounded-full border font-semibold ${getStatusColor(appeal.status)}`}>
              {appeal.status.charAt(0).toUpperCase() + appeal.status.slice(1)}
            </span>
          </div>
          <p className="text-gray-400">Review and respond to this appeal</p>
        </div>

        {/* Appeal Information */}
        <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-discord-700">
          <div>
            <p className="text-gray-400 text-sm mb-2">Appeal ID</p>
            <p className="text-white font-mono text-sm">{appeal.id}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-2">User Discord Tag</p>
            <p className="text-white">{appeal.userDiscordTag || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-2">Created</p>
            <p className="text-white">{new Date(appeal.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-2">Last Updated</p>
            <p className="text-white">{new Date(appeal.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Appeal Reason */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">Appeal Message</h2>
          <div className="bg-discord-700/50 rounded-lg p-4 border border-discord-600">
            <p className="text-gray-300">{appeal.reason}</p>
          </div>
        </div>

        {/* Response Section */}
        {appeal.status === 'pending' && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-3">Your Response</h2>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full bg-discord-700 border border-discord-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              rows={4}
              placeholder="Enter your response (optional)..."
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleUpdateStatus('approved')}
                disabled={updating}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                {updating ? 'Processing...' : 'Approve Appeal'}
              </button>
              <button
                onClick={() => handleUpdateStatus('denied')}
                disabled={updating}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <XCircle size={18} />
                {updating ? 'Processing...' : 'Deny Appeal'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
