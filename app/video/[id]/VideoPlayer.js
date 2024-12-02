'use client';

export default function VideoPlayer({ video }) {
  return (
    <div className="aspect-video mb-4">
      <video src={video.url} controls className="w-full h-full" autoPlay />
    </div>
  );
}