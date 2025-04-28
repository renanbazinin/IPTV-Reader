import { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';
import '../styles/VideoPlayer.css';

export default function VideoPlayer({ url }) {
  const videoRef = useRef();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;
    
    const video = videoRef.current;
    setLoading(true);
    setError(null);

    let hls = null;
    
    const handleCanPlay = () => setLoading(false);
    const handleError = (e) => {
      console.error("Video playback error:", e);
      setError("Error playing this stream. Please try another channel.");
      setLoading(false);
    };

    try {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support
        video.src = url;
      } else if (Hls.isSupported()) {
        // HLS.js support
        hls = new Hls({
          maxBufferLength: 30,         // Increase buffer length
          maxMaxBufferLength: 60,      // Maximum buffer size
          enableWorker: true,          // Enable web workers for better performance
          lowLatencyMode: false,       // Disable low latency for more stability
          startLevel: -1,              // Auto level selection
          startPosition: -1,           // Start from live point
          debug: false                 // Set to true for debugging
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
              // Try to recover network error
              console.log('Network error, trying to recover...');
              hls.startLoad();
            } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
              // Try to recover media error
              console.log('Media error, trying to recover...');
              hls.recoverMediaError();
            } else {
              // Unrecoverable error
              handleError(new Error(`HLS fatal error: ${data.details}`));
            }
          }
        });
        
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        setError("Your browser doesn't support HLS playback");
      }
    } catch (err) {
      handleError(err);
    }

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      if (hls) {
        hls.destroy();
      }
    };
  }, [url]);

  return (
    <div className="video-wrapper">
      {loading && <div className="video-loader">Loading stream...</div>}
      {error && <div className="video-error">{error}</div>}
      <video 
        ref={videoRef} 
        controls 
        autoPlay 
        className="video-player"
      />
    </div>
  );
}
