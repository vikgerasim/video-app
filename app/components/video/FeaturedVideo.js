// app/components/video/FeaturedVideo.js
import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedVideo({ video }) {
  return (
    <div suppressHydrationWarning className="bg-white rounded-lg shadow-lg overflow-hidden">
      <Link href={`/video/${video.id}`}>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative aspect-video w-full bg-black">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-0 h-0 border-t-[30px] border-b-[30px] border-l-[50px] border-transparent border-l-white" />
            </div>
            {video.duration && (
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 px-2 py-1 rounded text-white">
                {video.duration}
              </div>
            )}
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">{video.title}</h2>
            <p className="text-gray-600 mb-4">{video.description}</p>
            <div className="flex items-center text-sm text-gray-500">
              <span className="font-medium text-gray-700">{video.userName}</span>
              <span className="mx-2">•</span>
              <span>{video.views} views</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}