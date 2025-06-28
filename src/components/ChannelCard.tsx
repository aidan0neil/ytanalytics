import { User } from 'lucide-react';
import { Channel } from '@/types/youtube';

interface ChannelCardProps {
  channel: Channel;
}

export default function ChannelCard({ channel }: ChannelCardProps) {
  return (
    <div className="text-center">
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
  );
} 