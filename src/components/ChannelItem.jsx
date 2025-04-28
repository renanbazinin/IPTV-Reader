export default function ChannelItem({ channel, onSelect }) {
  return (
    <button
      className="channel-item"
      onClick={() => onSelect(channel)}
      title={channel.title}
    >
      <img src={channel.logo} alt={channel.title} />
      <span>{channel.title}</span>
    </button>
  );
}
