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

  return (
    <div className="app">
      <h1>IPTV Reader</h1>
      <PlaylistUploader onLoad={setChannels}/>
      <FilterBar groups={groups} filter={filter} onFilterChange={setFilter}/>
      <div className="channel-slider-container">
        <div className="channel-slider">
          <ChannelList channels={filtered} onSelect={setCurrent}/>
        </div>
      </div>
      {current && (
        <div className="video-container">
          <VideoPlayer url={current.url} />
        </div>
      )}
    </div>
  );
}
