'use client';
import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Music } from 'lucide-react';

export default function BackgroundMusic({ youtubeUrl }) {
  const [playing, setPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Listen for a custom event dispatched when the user clicks the open door button
    const handleStartMusic = () => {
      setPlaying(true);
    };
    
    window.addEventListener('start-wedding-music', handleStartMusic);
    return () => window.removeEventListener('start-wedding-music', handleStartMusic);
  }, []);

  const toggleMusic = () => {
    setPlaying(!playing);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Hidden YouTube Player */}
      <div className="hidden opacity-0 pointer-events-none fixed top-0 left-0 w-0 h-0">
        <ReactPlayer
          url={youtubeUrl}
          playing={playing}
          loop={true}
          width="1px"
          height="1px"
          volume={0.5}
          playsinline={true}
          config={{
            youtube: {
              playerVars: { 
                autoplay: 0,
                controls: 0,
                showinfo: 0,
                rel: 0
              }
            }
          }}
        />
      </div>

      {/* Floating Music Button */}
      <button 
        onClick={toggleMusic}
        aria-label="Toggle Music"
        className="fixed bottom-6 right-6 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-[0_8px_22px_rgba(0,0,0,0.15)] border border-gray-100 flex items-center justify-center z-[100] transition-all duration-300 hover:scale-105"
      >
        {playing ? (
          <div className="relative flex items-center justify-center w-full h-full">
            <Music className="w-6 h-6 text-[#8B6CA8] animate-pulse" />
            <div className="absolute w-2 h-2 rounded-full bg-[#8B6CA8] animate-ping" style={{ top: '8px', right: '12px' }}></div>
          </div>
        ) : (
          <div className="relative flex items-center justify-center w-full h-full text-gray-400">
             <Music className="w-6 h-6 opacity-60" />
             <div className="absolute inset-0 flex items-center justify-center rotate-45">
               <div className="w-8 h-[2px] bg-red-400/80 rounded-full"></div>
             </div>
          </div>
        )}
      </button>
    </>
  );
}
