// FeaturedVideo.js
import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedVideo({ videos }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {videos.map((video) => (
        <div key={video.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <Link href={`/video/${video.id}`}>
            <div className="flex flex-col">
              <div className="relative aspect-video w-full">
                <Image 
                  src={video.thumbnailUrl}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center group-hover:bg-opacity-30 transition-opacity">
                  <div className="w-0 h-0 border-t-[20px] border-b-[20px] border-l-[32px] border-transparent border-l-white opacity-80" />
                </div>
              </div>
              
              <div className="p-4">
                <h2 className="font-semibold text-base mb-2 line-clamp-2">{video.title}</h2>
                <div className="flex flex-col space-y-1 text-sm text-gray-600">
                  <span className="font-medium">{video.userName}</span>
                  <div className="flex items-center space-x-1">
                    <span>{video.views} views</span>
                    <span>•</span>
                    <span>{video.uploadedAt}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}