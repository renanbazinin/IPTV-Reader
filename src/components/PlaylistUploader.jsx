import { useState } from 'react';
import { parseM3U8 } from '../utils/parseM3U8';

export default function PlaylistUploader({ onLoad, onDirectStream }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = async e => {
    if (!e.target.files || !e.target.files[0]) return;
    
    try {
      setLoading(true);
      setError(null);
      const file = e.target.files[0];
      const text = await file.text();
      
      // Check if this might be a direct stream
      if (file.name.toLowerCase().endsWith('.m3u8') && !text.includes('#EXTINF')) {
        // This is likely a direct stream
        onDirectStream({
          title: file.name.split('/').pop().replace('.m3u8', ''),
          url: URL.createObjectURL(file)
        });
      } else {
        // Regular playlist
        const channels = parseM3U8(text, file.name);
        onLoad(channels);
      }
    } catch (err) {
      console.error("Error parsing file:", err);
      setError("Failed to parse playlist file");
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = async () => {
    if (!url.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      
      const text = await res.text();
      
      // Check if this might be a direct stream
      const isDirectStream = url.toLowerCase().endsWith('.m3u8') && !text.includes('#EXTINF');
      
      if (isDirectStream) {
        // Play direct stream immediately
        onDirectStream({
          title: url.split('/').pop().replace('.m3u8', ''),
          url: url
        });
      } else {
        // Regular playlist
        const channels = parseM3U8(text, url);
        onLoad(channels);
      }
    } catch (err) {
      console.error("Error fetching playlist:", err);
      setError("Failed to fetch or parse playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="uploader">
      <input
        type="file"
        accept=".m3u,.m3u8,application/vnd.apple.mpegurl"
        onChange={handleFile}
        disabled={loading}
      />
      <div>
        <input
          type="text"
          placeholder="Paste playlist URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
          disabled={loading}
        />
        <button onClick={handleFetch} disabled={loading}>
          {loading ? 'Loading...' : 'Load'}
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
