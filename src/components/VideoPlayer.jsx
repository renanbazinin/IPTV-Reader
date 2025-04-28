import { useRef, useEffect } from 'react';
import Hls from 'hls.js';
import '../styles/VideoPlayer.css';

export default function VideoPlayer({ url }) {
  const videoRef = useRef();

  useEffect(() => {
    if (!url) return;
    const video = videoRef.current;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
  }, [url]);

  return <video ref={videoRef} controls autoPlay className="video-player" />;
}
