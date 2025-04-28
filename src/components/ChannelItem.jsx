export default function ChannelItem({ channel, onSelect }) {
  return (
    <button
      className="channel-item"
      onClick={() => onSelect(channel)}
      title={channel.title}
    >
      {channel.logo ? (
        <img src={channel.logo} alt={channel.title} />
      ) : (
        <div className="placeholder-logo">
          <span>{channel.title.substring(0, 2).toUpperCase()}</span>
        </div>
      )}
      <span>{channel.title}</span>
    </button>
  );
}
