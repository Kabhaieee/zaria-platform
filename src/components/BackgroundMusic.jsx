'use client';

/**
 * @file src/components/BackgroundMusic.jsx
 * @description Floating background audio controller powered by the YouTube IFrame JS API.
 * Preloads the YouTube embed iframe in the background so that when the guest opens
 * the invitation door (`start-wedding-music` event) or interacts with a direct template
 * (`autoPlay={true}`), playback starts seamlessly across desktop and mobile browsers.
 */

// 1. React and Next.js core modules
import { useCallback, useEffect, useRef, useState } from 'react';

// 2. Third-party libraries
import { Music } from 'lucide-react';

/**
 * Extracts the 11-character YouTube video ID from a standard YouTube URL.
 *
 * @param {string} url - Full YouTube watch or short URL.
 * @returns {string} The extracted video ID, or a fallback ID if parsing fails.
 */
const extractVideoId = (url) => {
  if (!url) return 'Hp8WTVqR_0U';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?/\s]{11})/);
  return match ? match[1] : 'Hp8WTVqR_0U';
};

/**
 * BackgroundMusic Component
 *
 * @param {Object} props - Component props.
 * @param {string} props.youtubeUrl - YouTube video/audio URL to stream in the background.
 * @param {boolean} [props.autoPlay=false] - Whether to auto-start on load / first interaction for templates without a door preloader.
 * @param {number} [props.startSeconds=0] - Optional start offset in seconds (e.g. 65 for 1:05).
 * @returns {JSX.Element | null} The offscreen YouTube player and floating mute/unmute toggle button.
 */
export default function BackgroundMusic({ youtubeUrl, autoPlay = false, startSeconds = 0 }) {
  const [playing, setPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const iframeRef = useRef(null);
  const playingRef = useRef(false);
  const userToggledRef = useRef(false);
  const hasSeekedRef = useRef(false);
  const buttonRef = useRef(null);

  const videoId = extractVideoId(youtubeUrl);

  /**
   * Sends a YouTube IFrame Player API command via `postMessage` restricted to the YouTube origin.
   *
   * @param {string} func - The YouTube player command name (e.g., 'playVideo', 'pauseVideo').
   * @param {Array<unknown>} [args=[]] - Optional command arguments.
   */
  const sendPlayerCommand = useCallback((func, args = []) => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      }
    } catch {
      // Safe guard against cross-origin or detached iframe errors
    }
  }, []);

  /**
   * Starts audio playback and sets a comfortable background volume level.
   * Seeks to `startSeconds` on the first playback trigger if configured.
   */
  const startPlayback = useCallback(() => {
    playingRef.current = true;
    setPlaying(true);
    sendPlayerCommand('unMute');
    sendPlayerCommand('setVolume', [60]);
    if (startSeconds > 0 && !hasSeekedRef.current) {
      sendPlayerCommand('seekTo', [startSeconds, true]);
      hasSeekedRef.current = true;
    }
    sendPlayerCommand('playVideo');
  }, [sendPlayerCommand, startSeconds]);

  /**
   * Pauses audio playback.
   */
  const pausePlayback = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
    sendPlayerCommand('pauseVideo');
  }, [sendPlayerCommand]);

  useEffect(() => {
    setMounted(true);

    /**
     * Automatically starts music playback when the invitation door is opened.
     */
    const handleStartMusic = () => {
      startPlayback();
      setTimeout(() => {
        if (playingRef.current) {
          startPlayback();
        }
      }, 600);
    };

    window.addEventListener('start-wedding-music', handleStartMusic);

    // Auto-play immediately on link open, with retries and universal interaction fallback
    if (autoPlay) {
      startPlayback();
      const t1 = setTimeout(startPlayback, 500);
      const t2 = setTimeout(startPlayback, 1200);
      const t3 = setTimeout(startPlayback, 2200);

      const handleFirstInteraction = (e) => {
        if (userToggledRef.current || playingRef.current) return;
        if (buttonRef.current && buttonRef.current.contains(e?.target)) return;
        startPlayback();
      };

      const interactionEvents = ['click', 'touchstart', 'touchend', 'pointerdown', 'scroll', 'keydown'];
      interactionEvents.forEach((evt) =>
        window.addEventListener(evt, handleFirstInteraction, { passive: true })
      );

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        window.removeEventListener('start-wedding-music', handleStartMusic);
        interactionEvents.forEach((evt) =>
          window.removeEventListener(evt, handleFirstInteraction)
        );
      };
    }

    return () => {
      window.removeEventListener('start-wedding-music', handleStartMusic);
    };
  }, [autoPlay, startPlayback]);

  /**
   * Toggles background music playback state between playing and paused.
   */
  const toggleMusic = () => {
    userToggledRef.current = true;
    if (playing) {
      pausePlayback();
    } else {
      startPlayback();
    }
  };

  // Prevent hydration mismatch by rendering only on the client
  if (!mounted) return null;

  const startParam = startSeconds > 0 ? `&start=${startSeconds}` : '';
  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1${autoPlay ? '&autoplay=1' : ''}${startParam}&playsinline=1&loop=1&playlist=${videoId}&controls=0&rel=0&showinfo=0`;

  return (
    <>
      {/* Offscreen YouTube Audio Stream Player (kept 1x1px so browsers allow audio playback) */}
      <div className="opacity-0 pointer-events-none fixed -bottom-10 -left-10 w-1 h-1 overflow-hidden">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title="Background Music"
          width="1"
          height="1"
          allow="autoplay; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          onLoad={() => {
            if (playingRef.current || (autoPlay && !userToggledRef.current)) {
              startPlayback();
            }
          }}
        />
      </div>

      {/* Floating Audio Toggle Control Button */}
      <button
        ref={buttonRef}
        onClick={toggleMusic}
        aria-label="Toggle Music"
        className="fixed bottom-6 right-6 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-[0_8px_22px_rgba(0,0,0,0.15)] border border-gray-100 flex items-center justify-center z-[100] transition-all duration-300 hover:scale-105"
      >
        {playing ? (
          <div className="relative flex items-center justify-center w-full h-full">
            <Music className="w-6 h-6 text-[#8B6CA8] animate-pulse" />
            <div
              className="absolute w-2 h-2 rounded-full bg-[#8B6CA8] animate-ping"
              style={{ top: '8px', right: '12px' }}
            ></div>
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
