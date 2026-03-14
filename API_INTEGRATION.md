# DBAB Dashboard - API Integration Guide

This guide helps you integrate the DBAB Dashboard with your DBAB API.

## Quick Start

1. **Ensure API is running**:
   ```bash
   cd ../dbab-api
   python main.py
   ```
   API should be running on `http://localhost:3000`

2. **Configure Discord OAuth2**:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Select your bot application
   - Go to OAuth2 → General
   - Add Redirect URI: `http://localhost:5173/auth/discord/callback`
   - Copy Client ID and Client Secret

3. **Update DBAB API config**:
   - Make sure your API config includes Discord OAuth credentials
   - The API should be configured to provide Discord auth URLs

4. **Run the dashboard**:
   ```bash
   npm install
   npm run dev
   ```
   Dashboard will be available at `http://localhost:5173`

## Required API Endpoints

The dashboard expects these endpoints from DBAB API:

### Auth Endpoints

```
GET /auth/discord-auth-url
Response: { "url": "https://discord.com/api/oauth2/authorize?..." }

POST /auth/discord-callback
Body: { "code": "oauth_code" }
Response: { 
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "discordId": "discord_id",
    "discordTag": "username#0000",
    "avatar": "avatar_url"
  }
}

GET /auth/me
Headers: Authorization: Bearer {token}
Response: { 
  "id": "user_id",
  "discordId": "discord_id",
  "discordTag": "username#0000",
  "avatar": "avatar_url"
}
```

### Guild Endpoints

```
GET /guilds
Headers: Authorization: Bearer {token}
Response: [
  {
    "id": "guild_id",
    "name": "Guild Name",
    "icon": "icon_hash",
    "ownerId": "owner_id"
  }
]

GET /guilds/{guildId}
Headers: Authorization: Bearer {token}
Response: {
  "id": "guild_id",
  "name": "Guild Name",
  "icon": "icon_hash",
  "ownerId": "owner_id"
}

GET /guilds/{guildId}/stats
Headers: Authorization: Bearer {token}
Response: {
  "guildId": "guild_id",
  "totalAppeals": 10,
  "pendingAppeals": 3,
  "approvedAppeals": 5,
  "deniedAppeals": 2
}
```

### Appeals Endpoints

```
GET /appeals
Headers: Authorization: Bearer {token}
Response: [
  {
    "id": "appeal_id",
    "userId": "user_id",
    "guildId": "guild_id",
    "reason": "Appeal message",
    "status": "pending|approved|denied",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "userDiscordTag": "username#0000"
  }
]

GET /appeals/{guildId}
Headers: Authorization: Bearer {token}
Response: [Appeal...]

GET /appeals/detail/{appealId}
Headers: Authorization: Bearer {token}
Response: Appeal

PUT /appeals/{appealId}
Headers: Authorization: Bearer {token}
Body: {
  "status": "approved|denied",
  "reason": "response_message"
}
Response: Appeal
```

## Notes

- All API endpoints require JWT authentication (Bearer token)
- Discord icons are loaded via CDN: `https://cdn.discordapp.com/icons/{guildId}/{iconHash}.png`
- The dashboard automatically handles JWT token storage and refresh
- Tokens are validated on app load and automatically cleared if invalid

## Troubleshooting

**CORS Errors?**
- Make sure your DBAB API has CORS configured for `http://localhost:5173`
- Add CORS headers to your API responses

**Auth not working?**
- Verify Discord OAuth2 redirect URI is set correctly
- Check that your API is returning tokens in the correct format
- Ensure tokens are JWT formatted

**Can't see any guilds?**
- Verify the bot is in your guilds
- Check that the API correctly returns guilds where the user is owner
- Ensure appealss are properly stored in the database
