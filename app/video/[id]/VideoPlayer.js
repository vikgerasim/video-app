'use client';

export default function VideoPlayer({ video }) {
  const getEmbedUrl = (url) => {
    const [, , , videoId, hash] = url.split('/');
    return `https://player.vimeo.com/video/${videoId}?h=${hash}`;
  };

  return (
    <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
      <iframe
        src={getEmbedUrl(video.url)}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}