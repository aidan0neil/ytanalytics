# YouTube Analytics Setup Guide

## Prerequisites

1. **Google Account**: You need a Google account to access YouTube data
2. **Google Cloud Console Access**: To create API credentials

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3:
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click on it and press "Enable"

## Step 2: Create API Credentials

### Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key (you'll need this for `YOUTUBE_API_KEY`)

### Create OAuth 2.0 Client
1. Click "Create Credentials" > "OAuth 2.0 Client IDs"
2. Choose "Web application"
3. Add these Authorized redirect URIs:
   - `http://localhost:3000/api/youtube/callback`
   - `http://localhost:3000/api/spotify/callback` (for development)
4. Copy the Client ID and Client Secret

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root with:

```env
# YouTube API Configuration
YOUTUBE_API_KEY=your_youtube_api_key_here
YOUTUBE_CLIENT_ID=your_oauth_client_id_here
YOUTUBE_CLIENT_SECRET=your_oauth_client_secret_here
YOUTUBE_REDIRECT_URI=http://localhost:3000/api/youtube/callback
```

## Step 4: Test the Setup

1. Run your development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Click "Connect with YouTube"
4. You should be redirected to Google's OAuth consent screen
5. After authorization, you should see your YouTube analytics dashboard

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI" error**:
   - Make sure the redirect URI in your OAuth client matches exactly
   - Check that you're using `http://localhost:3000` (not `https://`)

2. **"API key not valid" error**:
   - Ensure the YouTube Data API v3 is enabled in your Google Cloud project
   - Check that your API key is correct

3. **"OAuth consent screen" issues**:
   - If you're in testing, add your email as a test user
   - Make sure your app is configured for external users if needed

4. **"Access denied" errors**:
   - Check that your OAuth client has the correct scopes
   - Ensure the YouTube Data API is enabled

### Required Scopes:
- `https://www.googleapis.com/auth/youtube.readonly`
- `https://www.googleapis.com/auth/youtube.force-ssl`
- `https://www.googleapis.com/auth/userinfo.profile`
- `https://www.googleapis.com/auth/userinfo.email`

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your API keys and secrets secure
- Use environment variables in production
- Consider using Google Cloud's IAM for additional security

## Production Deployment

For production, you'll need to:
1. Update the redirect URI to your production domain
2. Configure your OAuth consent screen for production
3. Set up proper environment variables on your hosting platform
4. Consider using Google Cloud's managed secrets service 