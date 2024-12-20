import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string | null;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  useEffect(() => {
    // Remove auto-play, just reset the playing state when URL changes
    if (audioUrl) {
      setIsPlaying(false);
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Audio playback failed:", error);
          setIsPlaying(false);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
      <div className="flex items-center justify-start space-x-2 mt-4">
        <button
            onClick={togglePlay}
            className="p-2 text-purple-500 hover:text-purple-700 focus:outline-none transform hover:scale-110 transition-transform duration-200"
            aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
        <audio
            ref={audioRef}
            src={audioUrl || ''}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
        />
      </div>
  );
};

export default AudioPlayer;