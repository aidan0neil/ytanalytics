'use client';

import { Play, User, Clock, Heart, Youtube } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import Header from '@/components/Header';
import AuthScreen from '@/components/AuthScreen';
import VideoCard from '@/components/VideoCard';
import ChannelCard from '@/components/ChannelCard';
import StatCard from '@/components/StatCard';
import { useYouTubeAuth } from '@/hooks/useYouTubeAuth';
import { useYouTubeData } from '@/hooks/useYouTubeData';
import { formatDuration, formatNumber } from '@/utils/formatters';

export default function Home() {
  const {
    isAuthenticated,
    userProfile,
    setUserProfile,
    accessToken,
    error,
    handleLogin,
    handleLogout,
  } = useYouTubeAuth();

  const { recentVideos, topChannels, analytics, isLoading } = useYouTubeData(accessToken);

  // Update user profile when data is fetched
  if (accessToken && !userProfile) {
    fetch(`/api/youtube?action=profile&token=${accessToken}`)
      .then(res => res.json())
      .then(data => setUserProfile(data))
      .catch(console.error);
  }

  if (error || !isAuthenticated) {
    return <AuthScreen isLoading={isLoading} error={error} onLogin={handleLogin} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner size="lg" text="Loading your YouTube data..." />
      </div>
    );
  }

  const stats = [
    {
      title: 'Recent Videos',
      value: analytics?.totalVideos || 0,
      icon: Play,
      color: 'bg-red-500/20',
    },
    {
      title: 'Subscribed Channels',
      value: analytics?.totalChannels || 0,
      icon: User,
      color: 'bg-blue-500/20',
    },
    {
      title: 'Total Watch Time',
      value: formatDuration(analytics?.totalWatchTime || 0),
      icon: Clock,
      color: 'bg-green-500/20',
    },
    {
      title: 'Total Likes',
      value: formatNumber(analytics?.totalLikes || 0),
      icon: Heart,
      color: 'bg-pink-500/20',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 to-red-600">
      <Header userProfile={userProfile} onLogout={handleLogout} />
      
      {/* Gradient fade from black to content */}
      <div className="h-8 bg-gradient-to-b from-black/90 to-transparent"></div>

      {/* Main content */}
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
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
                <ChannelCard key={channel.id} channel={channel} />
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
                <VideoCard key={video.id} video={video} />
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