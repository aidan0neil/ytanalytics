export interface Video {
  id: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  thumbnailUrl?: string;
  description?: string;
}

export interface Channel {
  id: string;
  title: string;
  thumbnailUrl?: string;
  subscriberCount?: number;
}

export interface Analytics {
  totalVideos: number;
  totalChannels: number;
  totalWatchTime: number;
  averageViews: number;
  totalLikes: number;
}

export interface UserProfile {
  name: string;
  email: string;
  picture: string;
} 