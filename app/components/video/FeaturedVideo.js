// app/components/video/FeaturedVideo.js
import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedVideo({ video }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <Link href={`/videos/${video.id}`}>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative aspect-video">
            <Image 
              src={video.thumbnailUrl}
              alt={video.title}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 px-2 py-1 rounded text-white">
              {video.duration}
            </div>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">{video.title}</h2>
            <p className="text-gray-600 mb-4">{video.description}</p>
            <div className="flex items-center text-sm text-gray-500">
              <span className="font-medium text-gray-700">{video.userName}</span>
              <span className="mx-2">•</span>
              <span>{video.views} views</span>
              <span className="mx-2">•</span>
              <span>{new Date(video.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}