import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(new URL('/?error=oauth_error', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch(`${request.nextUrl.origin}/api/youtube?action=callback&code=${code}`);
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      throw new Error(tokenData.error || 'Failed to get access token');
    }

    // Redirect to the main page with tokens
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('access_token', tokenData.access_token);
    if (tokenData.refresh_token) {
      redirectUrl.searchParams.set('refresh_token', tokenData.refresh_token);
    }
    redirectUrl.searchParams.set('expires_in', tokenData.expires_in.toString());

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
} 