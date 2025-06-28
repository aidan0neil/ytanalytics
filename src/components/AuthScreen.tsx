import { Youtube } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface AuthScreenProps {
  isLoading: boolean;
  error: string | null;
  onLogin: () => void;
}

export default function AuthScreen({ isLoading, error, onLogin }: AuthScreenProps) {
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
            onClick={onLogin}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 to-red-600 flex flex-col">
      {/* Header with black background */}
      <div className="bg-black/90 backdrop-blur-sm">
        <div className="pt-8 pb-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">YouTube Analytics, Reimagined.</h1>
            <div className="flex justify-center space-x-6 text-white/80 text-lg font-medium">
              <span>Clean dashboards.</span>
              <span>Actionable data.</span>
              <span>Designed for creators.</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gradient fade from black to content */}
      <div className="h-8 bg-gradient-to-b from-black/90 to-transparent"></div>

      {/* Main content - centered */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Youtube className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">YouTube Analytics</h2>
            <p className="text-white/80 text-lg">Discover insights about your viewing habits</p>
          </div>
          
          <button
            onClick={onLogin}
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
          
          <p className="text-white/60 text-sm mt-6">
            Connect your YouTube account to view your personalized analytics
          </p>
        </div>
      </div>
    </div>
  );
} 