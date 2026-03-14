# DBAB Dashboard

A modern, responsive React dashboard for managing Discord ban appeals. Built with Vite, React, TypeScript, and Tailwind CSS.

## Features

- 🔐 Discord OAuth2 Authentication
- 📊 Server Management Dashboard
- 📋 Ban Appeal Management
- ✅ Appeal Approval/Denial System
- 💬 Appeal Response Messages
- 🎨 Modern Dark Theme UI
- ⚡ Fast Performance with Vite
- 📱 Fully Responsive Design

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Authentication**: Discord OAuth2

## Prerequisites

- Node.js 16+ and npm/yarn
- DBAB API running on http://localhost:3000
- DBAB Bot with OAuth2 configuration
- Discord Application with OAuth2 setup

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env.local
   ```

3. **Configure Discord OAuth** in your API's config file:
   - Ensure your Discord app has a redirect URI set to `http://localhost:5173/auth/discord/callback`
   - The API will provide the Discord auth URL via the `/auth/discord-auth-url` endpoint

4. **Update your DBAB API** to include Discord OAuth endpoints:
   - `GET /auth/discord-auth-url` - Returns the Discord authorization URL
   - `POST /auth/discord-callback` - Handles Discord OAuth callback and returns JWT token
   - `GET /auth/me` - Returns current user information

## Running Development Server

```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

Distributable files will be in the `dist/` folder.

## Project Structure

```
src/
├── components/          # Reusable components
├── contexts/           # React contexts (Auth)
├── pages/             # Page components
├── services/          # API service calls
├── App.tsx            # Main app component
├── App.css            # App-level styles
├── index.css          # Global styles
└── main.tsx           # Vite entry point
```

## API Integration

The dashboard communicates with the DBAB API via REST. Ensure your API implements these endpoints:

### Authentication
- `GET /auth/discord-auth-url` - Get Discord OAuth URL
- `POST /auth/discord-callback` - Handle OAuth callback
- `GET /auth/me` - Get current user

### Appeals
- `GET /appeals` - Get all appeals
- `GET /appeals/{guildId}` - Get guild appeals
- `GET /appeals/detail/{appealId}` - Get appeal details
- `PUT /appeals/{appealId}` - Update appeal status

### Guilds
- `GET /guilds` - Get user's guilds
- `GET /guilds/{guildId}` - Get guild details
- `GET /guilds/{guildId}/stats` - Get guild statistics

## Environment Variables

See `.env.example` for all available variables:

- `VITE_API_URL` - URL of the DBAB API (default: http://localhost:3000)

## Styling

The dashboard uses Tailwind CSS with custom color variables for a Discord-themed dark mode. Colors are defined in:
- `tailwind.config.js` - Tailwind configuration
- `src/index.css` - CSS custom properties

## Authentication Flow

1. User clicks "Login with Discord"
2. Redirected to Discord OAuth authorization
3. User authorizes and is redirected back to `/auth/discord/callback`
4. JWT token and user data are stored in localStorage
5. User can now access protected dashboard routes

## Contributing

Feel free to submit issues and enhancement requests!

## License

See parent repository for license information.
