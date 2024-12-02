'use client';
 
export default function VideoPlayer({ video }) {
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
 
  return (
    <div className="aspect-video mb-4">
      <video src={video.url} controls className="w-full h-full" autoPlay />
    </div>
  );
}