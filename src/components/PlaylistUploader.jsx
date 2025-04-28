import { useState } from 'react';
import { parseM3U8 } from '../utils/parseM3U8';

export default function PlaylistUploader({ onLoad }) {
  const [url, setUrl] = useState('');

  const handleFile = async e => {
    const text = await e.target.files[0].text();
    onLoad(parseM3U8(text));
  };

  const handleFetch = async () => {
    const res = await fetch(url);
    const text = await res.text();
    onLoad(parseM3U8(text));
  };

  return (
    <div className="uploader">
      <input
        type="file"
        accept=".m3u,.m3u8,application/vnd.apple.mpegurl"
        onChange={handleFile}
      />
      <div>
        <input
          type="text"
          placeholder="Paste playlist URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <button onClick={handleFetch}>Load</button>
      </div>
    </div>
  );
}
