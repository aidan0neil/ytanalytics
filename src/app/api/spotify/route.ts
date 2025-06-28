import { NextRequest, NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const YOUTUBE_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const YOUTUBE_REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/api/spotify/callback';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'auth':
        const scopes = [
          'https://www.googleapis.com/auth/youtube.readonly',
          'https://www.googleapis.com/auth/youtube.force-ssl',
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email'
        ];
        
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${YOUTUBE_CLIENT_ID}&` +
          `redirect_uri=${encodeURIComponent(YOUTUBE_REDIRECT_URI)}&` +
          `scope=${encodeURIComponent(scopes.join(' '))}&` +
          `response_type=code&` +
          `access_type=offline&` +
          `prompt=consent`;
        
        return NextResponse.json({ authUrl });

      case 'callback':
        const code = searchParams.get('code');
        if (!code) {
          return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
        }

        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: YOUTUBE_CLIENT_ID!,
            client_secret: YOUTUBE_CLIENT_SECRET!,
            code,
            grant_type: 'authorization_code',
            redirect_uri: YOUTUBE_REDIRECT_URI,
          }),
        });

        const tokenData = await tokenResponse.json();
        
        if (!tokenResponse.ok) {
          throw new Error(tokenData.error || 'Failed to get access token');
        }

        return NextResponse.json({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_in: tokenData.expires_in
        });

      case 'profile':
        const token = searchParams.get('token');
        if (!token) {
          return NextResponse.json({ error: 'No access token provided' }, { status: 400 });
        }

        const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const profileData = await profileResponse.json();
        return NextResponse.json(profileData);

      case 'recent-videos':
        const accessToken = searchParams.get('token');
        if (!accessToken) {
          return NextResponse.json({ error: 'No access token provided' }, { status: 400 });
        }

        // Get user's watch history (recent videos)
        const historyResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/activities?part=snippet,contentDetails&mine=true&maxResults=20&key=${YOUTUBE_API_KEY}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        const historyData = await historyResponse.json();
        return NextResponse.json(historyData);

      case 'top-channels':
        const channelsToken = searchParams.get('token');
        if (!channelsToken) {
          return NextResponse.json({ error: 'No access token provided' }, { status: 400 });
        }

        // Get user's subscriptions (top channels)
        const subscriptionsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=10&key=${YOUTUBE_API_KEY}`,
          {
            headers: {
              'Authorization': `Bearer ${channelsToken}`,
            },
          }
        );

        const subscriptionsData = await subscriptionsResponse.json();
        return NextResponse.json(subscriptionsData);

      case 'liked-videos':
        const likedToken = searchParams.get('token');
        if (!likedToken) {
          return NextResponse.json({ error: 'No access token provided' }, { status: 400 });
        }

        // Get user's liked videos
        const likedResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&myRating=like&maxResults=20&key=${YOUTUBE_API_KEY}`,
          {
            headers: {
              'Authorization': `Bearer ${likedToken}`,
            },
          }
        );

        const likedData = await likedResponse.json();
        return NextResponse.json(likedData);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 