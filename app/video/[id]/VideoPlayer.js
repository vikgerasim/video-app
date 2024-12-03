'use client';
 
export default function VideoPlayer({ video }) {
<<<<<<< HEAD
  const getEmbedUrl = (url) => {
    const [, , , videoId, hash] = url.split('/');
    return `https://player.vimeo.com/video/${videoId}?h=${hash}`;
  };

=======
  if (video.platform === 'vimeo') {
    return (
      <div style={{ padding: '74.84% 0 0 0', position: 'relative' }}>
        <iframe
          src={video.embedUrl}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
          allowFullScreen
          title={video.title}
        />
      </div>
    );
  }
 
>>>>>>> f5a50e810a42ce4ee928a68283b7987cfba7745e
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