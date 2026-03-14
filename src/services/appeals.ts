import api from './api';

export interface Appeal {
  id: string;
  userId: string;
  guildId: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  createdAt: string;
  updatedAt: string;
  userDiscordTag?: string;
}

export interface Guild {
  id: string;
  name: string;
  icon?: string;
  ownerId: string;
}

export interface User {
  id: string;
  discordId: string;
  discordTag: string;
  avatar?: string;
  email?: string;
}

// Appeals endpoints
export const appealsAPI = {
  getGuildAppeals: (guildId: string) =>
    api.get<Appeal[]>(`/appeals/${guildId}`),
  
  getAppeal: (appealId: string) =>
    api.get<Appeal>(`/appeals/detail/${appealId}`),
  
  updateAppealStatus: (appealId: string, status: 'approved' | 'denied', reason?: string) =>
    api.put(`/appeals/${appealId}`, { status, reason }),
  
  getAllAppeals: () =>
    api.get<Appeal[]>(`/appeals`),
};

// Guilds endpoints
export const guildsAPI = {
  getUserGuilds: () =>
    api.get<Guild[]>(`/guilds`),
  
  getGuild: (guildId: string) =>
    api.get<Guild>(`/guilds/${guildId}`),
  
  getGuildStats: (guildId: string) =>
    api.get(`/guilds/${guildId}/stats`),
};

// Users endpoints
export const usersAPI = {
  getCurrentUser: () =>
    api.get<User>(`/auth/me`),
  
  updateUser: (data: Partial<User>) =>
    api.put(`/auth/me`, data),
};

// Auth endpoints
export const authAPI = {
  getDiscordAuthUrl: () =>
    api.get<{ url: string }>(`/auth/discord-auth-url`),
  
  handleDiscordCallback: (code: string) =>
    api.post<{ token: string; user: User }>(`/auth/discord-callback`, { code }),
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};
