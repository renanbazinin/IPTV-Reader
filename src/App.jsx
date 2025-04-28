import { useState, useMemo } from 'react';
import PlaylistUploader from './components/PlaylistUploader';
import FilterBar from './components/FilterBar';
import ChannelList from './components/ChannelList';
import VideoPlayer from './components/VideoPlayer';
import './styles/App.css';
import './styles/ChannelSlider.css';

export default function App() {
  const [channels, setChannels] = useState([]);
  const [filter, setFilter] = useState({ group: '', search: '' });
  const [current, setCurrent] = useState(null);

  const groups = useMemo(
    () => [...new Set(channels.map(c => c.group).filter(Boolean))],
    [channels]
  );

  const filtered = useMemo(() => {
    return channels.filter(c => {
      return (
        (!filter.group || c.group === filter.group)
        && c.title.toLowerCase().includes(filter.search.toLowerCase())
      );
    });
  }, [channels, filter]);

  // Handle a direct stream by immediately playing it
  const handleDirectStream = (stream) => {
    setCurrent({
      id: 'direct-stream',
      title: stream.title,
      url: stream.url
    });
    // Clear the channel list since we're just playing a direct stream
    setChannels([]);
  };

  return (
    <div className="app">
      <h1>IPTV Reader</h1>
      <PlaylistUploader 
        onLoad={setChannels} 
        onDirectStream={handleDirectStream}
      />
      
      {channels.length > 0 && (
        <FilterBar groups={groups} filter={filter} onFilterChange={setFilter}/>
      )}
      
      {channels.length > 0 && (
        <div className="channel-slider-container">
          <div className="channel-slider">
            <ChannelList channels={filtered} onSelect={setCurrent}/>
          </div>
        </div>
      )}
      
      {current && (
        <div className="video-container">
          <VideoPlayer url={current.url} />
          {current.title && (
            <div className="current-title">{current.title}</div>
          )}
        </div>
      )}
    </div>
  );
}
