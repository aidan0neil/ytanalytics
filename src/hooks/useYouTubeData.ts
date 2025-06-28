import { useState, useEffect } from 'react';
import { Video, Channel, Analytics } from '@/types/youtube';

const SAMPLE_VIDEOS: Video[] = [
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

export const useYouTubeData = (accessToken: string | null) => {
  const [recentVideos, setRecentVideos] = useState<Video[]>([]);
  const [topChannels, setTopChannels] = useState<Channel[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (accessToken) {
      fetchUserData(accessToken);
    }
  }, [accessToken]);

  const fetchUserData = async (token: string) => {
    setIsLoading(true);
    try {
      // Fetch user profile
      const profileResponse = await fetch(`/api/youtube?action=profile&token=${token}`);
      const profileData = await profileResponse.json();

      // Fetch recent videos
      const videosResponse = await fetch(`/api/youtube?action=recent-videos&token=${token}`);
      const videosData = await videosResponse.json();
      
      const formattedVideos: Video[] = videosData.items?.map((item: any) => ({
        id: item.id || item.contentDetails?.upload?.videoId,
        title: item.snippet?.title || 'Unknown Title',
        channelTitle: item.snippet?.channelTitle || 'Unknown Channel',
        publishedAt: item.snippet?.publishedAt || '',
        viewCount: item.statistics?.viewCount || 0,
        likeCount: item.statistics?.likeCount || 0,
        thumbnailUrl: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url,
        description: item.snippet?.description,
      })) || [];
      
      // Use sample videos if no real videos found
      const finalVideos = formattedVideos.length > 0 ? formattedVideos : SAMPLE_VIDEOS;
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

      // Calculate analytics
      const totalLikes = finalVideos.reduce((sum, v) => sum + (parseInt(v.likeCount.toString()) || 0), 0);
      
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
    } finally {
      setIsLoading(false);
    }
  };

  return {
    recentVideos,
    topChannels,
    analytics,
    isLoading,
  };
}; 