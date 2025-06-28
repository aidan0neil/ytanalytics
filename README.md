# YouTube Analytics Dashboard

A beautiful, locally hosted analytics dashboard for your YouTube data built with Next.js, React, and TypeScript.

## Features

- 📺 **Real-time YouTube Integration** - Connect your YouTube account to get live data
- 📊 **Comprehensive Analytics** - View your viewing habits, top channels, and video insights
- 🎨 **Beautiful UI** - Modern, responsive design with glassmorphism effects
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🔒 **Secure Authentication** - OAuth 2.0 with Google's official API
- ⚡ **Fast Performance** - Built with Next.js 14 and optimized for speed

## Screenshots

- **Login Screen**: Clean authentication interface with YouTube branding
- **Dashboard**: Overview of your video statistics and recent activity
- **Analytics**: Detailed insights about your viewing patterns
- **Recent Videos**: Your latest watched videos with engagement metrics

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google account
- Google Cloud Console access

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd youtube-analytics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Google Cloud credentials**
   
   Follow the detailed setup guide in [SETUP.md](./SETUP.md) to:
   - Create a Google Cloud project
   - Enable YouTube Data API v3
   - Create API credentials (API Key and OAuth 2.0 Client)
   - Configure redirect URIs

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your YouTube credentials:
   ```env
   YOUTUBE_API_KEY=your_youtube_api_key_here
   YOUTUBE_CLIENT_ID=your_oauth_client_id_here
   YOUTUBE_CLIENT_SECRET=your_oauth_client_secret_here
   YOUTUBE_REDIRECT_URI=http://localhost:3000/api/youtube/callback
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Usage

1. **Connect with YouTube**: Click the "Connect with YouTube" button on the login page
2. **Authorize Access**: Grant the necessary permissions to access your YouTube data
3. **Explore Analytics**: View your personalized dashboard with video insights

## API Endpoints

- `GET /api/youtube?action=auth` - Get YouTube authorization URL
- `GET /api/youtube?action=callback&code=<code>` - Exchange authorization code for tokens
- `GET /api/youtube?action=profile&token=<token>` - Get user profile
- `GET /api/youtube?action=recent-videos&token=<token>` - Get recently watched videos
- `GET /api/youtube?action=top-channels&token=<token>` - Get subscribed channels
- `GET /api/youtube?action=liked-videos&token=<token>` - Get liked videos

## Technologies Used

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Lucide React icons
- **Charts**: Recharts (for future enhancements)
- **Backend**: Next.js API routes
- **Authentication**: Google OAuth 2.0
- **API**: YouTube Data API v3

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── youtube/
│   │       ├── route.ts
│   │       └── callback/
│   │           └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── LoadingSpinner.tsx
│   ├── StatCard.tsx
│   └── TrackCard.tsx
└── lib/ (future)
```

## Features in Development

- [ ] Advanced charts and visualizations
- [ ] Watch history analysis
- [ ] Channel performance metrics
- [ ] Video recommendations
- [ ] Export functionality
- [ ] Dark/light theme toggle
- [ ] Watch time heatmaps

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

## Acknowledgments

- [YouTube Data API v3](https://developers.google.com/youtube/v3)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/)
# ytanalytics
