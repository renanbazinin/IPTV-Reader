import ChannelItem from './ChannelItem';

export default function ChannelList({ channels, onSelect }) {
  return (
    <div className="channel-list">
      {channels.map(ch =>
        <ChannelItem key={ch.id} channel={ch} onSelect={onSelect}/>
      )}
    </div>
  );
}

