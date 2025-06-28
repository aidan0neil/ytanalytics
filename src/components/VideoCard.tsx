import { Play, Eye, Heart } from 'lucide-react';
import { Video } from '@/types/youtube';
import { formatNumber } from '@/utils/formatters';

interface VideoCardProps {
  video: Video;
  onClick?: () => void;
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  return (
    <div 
      className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all cursor-pointer group"
      onClick={onClick}
    >
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
  );
} 