import { Youtube, LogOut } from 'lucide-react';
import { UserProfile } from '@/types/youtube';

interface HeaderProps {
  userProfile: UserProfile | null;
  onLogout: () => void;
}

export default function Header({ userProfile, onLogout }: HeaderProps) {
  return (
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
              onClick={onLogout}
              className="bg-white/10 hover:bg-white/20 text-white/70 hover:text-white p-2 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 