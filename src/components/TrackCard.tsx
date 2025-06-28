import { Music } from 'lucide-react';

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  popularity: number;
  imageUrl?: string;
}

interface TrackCardProps {
  track: Track;
  onClick?: () => void;
}

export default function TrackCard({ track, onClick }: TrackCardProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          {track.imageUrl ? (
            <img 
              src={track.imageUrl} 
              alt={track.album}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <Music className="w-6 h-6 text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold truncate">{track.name}</h3>
          <p className="text-white/70 text-sm truncate">{track.artist}</p>
          <p className="text-white/50 text-xs truncate">{track.album}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-white/70 text-sm">{formatDuration(track.duration)}</div>
          <div className="text-green-400 text-xs font-medium">{track.popularity}%</div>
        </div>
      </div>
    </div>
  );
} 