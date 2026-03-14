import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { DiscordCallback } from './pages/DiscordCallback';
import { Dashboard } from './pages/Dashboard';
import { GuildAppeals } from './pages/GuildAppeals';
import { AppealDetail } from './pages/AppealDetail';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/discord/callback" element={<DiscordCallback />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/guild/:guildId/appeals"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-discord-950 via-discord-900 to-discord-800 p-8">
                  <div className="max-w-7xl mx-auto">
                    <GuildAppeals />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/appeal/:appealId"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-discord-950 via-discord-900 to-discord-800 p-8">
                  <div className="max-w-7xl mx-auto">
                    <AppealDetail />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
