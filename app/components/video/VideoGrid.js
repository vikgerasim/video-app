import Link from 'next/link';
import VideoCard from './VideoCard';

export default function VideoGrid({ videos }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map((video) => (
        <Link key={video.id} href={`/videos/${video.id}`}>
          <VideoCard video={video} />
        </Link>
      ))}
    </div>
  );
}