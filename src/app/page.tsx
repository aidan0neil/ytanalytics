'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Play, User, Clock, Eye, Heart, LogOut, Youtube } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Video {
  id: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  thumbnailUrl?: string;
  description?: string;
}

interface Channel {
  id: string;
  title: string;
  thumbnailUrl?: string;
  subscriberCount?: number;
}

interface Analytics {
  totalVideos: number;
  totalChannels: number;
  totalWatchTime: number;
  averageViews: number;
  totalLikes: number;
}

export default function Home() {
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [recentVideos, setRecentVideos] = useState<Video[]>([]);
  const [topChannels, setTopChannels] = useState<Channel[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check for tokens in URL params (from OAuth callback)
  useEffect(() => {
    const token = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const errorParam = searchParams.get('error');
    
    if (errorParam) {
      setError(errorParam);
      return;
    }
    
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);
      fetchUserData(token);
    }
  }, [searchParams]);

  const fetchUserData = async (token: string) => {
    setIsLoading(true);
    try {
      // Fetch user profile
      const profileResponse = await fetch(`/api/youtube?action=profile&token=${token}`);
      const profileData = await profileResponse.json();
      setUserProfile(profileData);

      // Fetch recent videos
      const videosResponse = await fetch(`/api/youtube?action=recent-videos&token=${token}`);
      const videosData = await videosResponse.json();
      
      const formattedVideos: Video[] = videosData.items?.map((item: any) => {
        return {
          id: item.id || item.contentDetails?.upload?.videoId,
          title: item.snippet?.title || 'Unknown Title',
          channelTitle: item.snippet?.channelTitle || 'Unknown Channel',
          publishedAt: item.snippet?.publishedAt || '',
          viewCount: item.statistics?.viewCount || 0,
          likeCount: item.statistics?.likeCount || 0,
          thumbnailUrl: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url,
          description: item.snippet?.description,
        };
      }) || [];
      
      // If no videos found, show sample videos for demo purposes
      let finalVideos = formattedVideos;
      if (formattedVideos.length === 0) {
        const sampleVideos: Video[] = [
          {
            id: 'sample1',
            title: 'Sample YouTube Video Title',
            channelTitle: 'Sample Channel',
            publishedAt: new Date().toISOString(),
            viewCount: 1500000,
            likeCount: 45000,
            thumbnailUrl: 'https://via.placeholder.com/320x180/ff0000/ffffff?text=Sample+Video',
            description: 'This is a sample video description to demonstrate the layout and design of the video cards.',
          },
          {
            id: 'sample2',
            title: 'Another Great Video Example',
            channelTitle: 'Demo Channel',
            publishedAt: new Date().toISOString(),
            viewCount: 890000,
            likeCount: 23000,
            thumbnailUrl: 'https://via.placeholder.com/320x180/ff0000/ffffff?text=Demo+Video',
            description: 'Here is another sample video with a longer description to show how the text truncation works in the card layout.',
          },
          {
            id: 'sample3',
            title: 'Amazing Content You Should Watch',
            channelTitle: 'Awesome Creator',
            publishedAt: new Date().toISOString(),
            viewCount: 2500000,
            likeCount: 67000,
            thumbnailUrl: 'https://via.placeholder.com/320x180/ff0000/ffffff?text=Amazing+Video',
            description: 'This demonstrates the full video card design with thumbnail, title, description, and view statistics.',
          }
        ];
        finalVideos = sampleVideos;
      }
      
      setRecentVideos(finalVideos);

      // Fetch top channels
      const channelsResponse = await fetch(`/api/youtube?action=top-channels&token=${token}`);
      const channelsData = await channelsResponse.json();
      
      const formattedChannels: Channel[] = channelsData.items?.map((item: any) => ({
        id: item.snippet?.resourceId?.channelId || item.id,
        title: item.snippet?.title || 'Unknown Channel',
        thumbnailUrl: item.snippet?.thumbnails?.default?.url,
        subscriberCount: item.statistics?.subscriberCount,
      })) || [];
      
      setTopChannels(formattedChannels);

      // Calculate analytics using the final videos array
      const totalLikes = finalVideos.reduce((sum, v) => {
        const likeCount = parseInt(v.likeCount.toString()) || 0;
        return sum + likeCount;
      }, 0);
      
      const analytics: Analytics = {
        totalVideos: finalVideos.length,
        totalChannels: formattedChannels.length,
        totalWatchTime: Math.floor(finalVideos.length * 10), // Mock data
        averageViews: Math.round(finalVideos.reduce((sum, v) => sum + (parseInt(v.viewCount.toString()) || 0), 0) / Math.max(finalVideos.length, 1)),
        totalLikes: totalLikes,
      };
      
      setAnalytics(analytics);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to fetch user data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleYouTubeLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/youtube?action=auth');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get auth URL');
      }
      
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('Error initiating YouTube auth:', error);
      setError('Failed to start authentication');
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    setRecentVideos([]);
    setTopChannels([]);
    setAnalytics(null);
    setAccessToken(null);
    setError(null);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-red-700">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Youtube className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">YouTube Analytics</h1>
            <p className="text-white/80 text-lg">Authentication Error</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
            <p className="text-white mb-4">There was an error during authentication:</p>
            <p className="text-red-200 font-mono text-sm">{error}</p>
          </div>
          
          <button
            onClick={handleYouTubeLogin}
            disabled={isLoading}
            className="bg-white hover:bg-gray-100 disabled:bg-white/50 text-red-500 font-semibold py-3 px-8 rounded-full flex items-center space-x-2 mx-auto transition-all"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Youtube className="w-5 h-5" />
                <span>Try Again</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-red-700">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Youtube className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">YouTube Analytics</h1>
            <p className="text-white/80 text-lg">Discover insights about your viewing habits</p>
          </div>
          
          <button
            onClick={handleYouTubeLogin}
            disabled={isLoading}
            className="bg-white hover:bg-gray-100 disabled:bg-white/50 text-red-500 font-semibold py-3 px-8 rounded-full flex items-center space-x-2 mx-auto transition-all"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Youtube className="w-5 h-5" />
                <span>Connect with YouTube</span>
              </>
            )}
          </button>
          
          <p className="text-white/60 text-sm mt-4">
            Connect your YouTube account to view your personalized analytics
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner size="lg" text="Loading your YouTube data..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 diagonal-lines">
      {/* Header with black background */}
      <div className="bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <Youtube className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">YouTube Analytics</h1>
                <p className="text-white/70">Welcome back, {userProfile?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img 
                  src={userProfile?.picture} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-white/70 text-sm">{userProfile?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white/70 hover:text-white p-2 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient fade from black to content */}
      <div className="h-8 bg-gradient-to-b from-black/90 to-transparent"></div>

      {/* Main content */}
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Recent Videos</p>
                <p className="text-2xl font-bold text-white">{analytics?.totalVideos || 0}</p>
              </div>
              <Play className="w-8 h-8 text-red-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Subscribed Channels</p>
                <p className="text-2xl font-bold text-white">{analytics?.totalChannels || 0}</p>
              </div>
              <User className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Watch Time</p>
                <p className="text-2xl font-bold text-white">{formatDuration(analytics?.totalWatchTime || 0)}</p>
              </div>
              <Clock className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Likes</p>
                <p className="text-2xl font-bold text-white">{formatNumber(analytics?.totalLikes || 0)}</p>
              </div>
              <Heart className="w-8 h-8 text-pink-400" />
            </div>
          </div>
        </div>

        {/* Top Channels */}
        {topChannels.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Your Top Channels
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {topChannels.slice(0, 5).map((channel) => (
                <div key={channel.id} className="text-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-2 mx-auto">
                    {channel.thumbnailUrl ? (
                      <img 
                        src={channel.thumbnailUrl} 
                        alt={channel.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/20 flex items-center justify-center">
                        <User className="w-8 h-8 text-white/50" />
                      </div>
                    )}
                  </div>
                  <p className="text-white/80 text-sm font-medium truncate">{channel.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Videos */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Play className="w-5 h-5 mr-2" />
            Recent Videos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto">
            {recentVideos.length > 0 ? (
              recentVideos.map((video) => (
                <div key={video.id} className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all cursor-pointer group">
                  {/* Thumbnail */}
                  <div className="relative">
                    <div className="w-full h-48 overflow-hidden">
                      {video.thumbnailUrl ? (
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/20 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white/50" />
                        </div>
                      )}
                    </div>
                    {/* Play button overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    {/* Title */}
                    <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                      {video.title}
                    </h3>
                    
                    {/* Channel */}
                    <p className="text-white/70 text-sm mb-3 font-medium">
                      {video.channelTitle}
                    </p>
                    
                    {/* Description */}
                    {video.description && (
                      <p className="text-white/60 text-sm mb-3 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4 text-white/50" />
                        <span className="text-white/70 text-sm font-medium">{formatNumber(video.viewCount)} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-white/50" />
                        <span className="text-white/70 text-sm font-medium">{formatNumber(video.likeCount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Youtube className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/50 text-lg">No recent videos found</p>
                <p className="text-white/40 text-sm mt-2">Connect your YouTube account to see your viewing history</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
