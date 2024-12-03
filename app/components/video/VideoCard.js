import Link from 'next/link';
import Image from 'next/image';

export default function VideoCard({ video }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black/50 backdrop-blur">
            <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-l-[16px] border-transparent border-l-white ml-1" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{video.title}</h3>
        <p className="text-gray-600 text-sm">{video.userName}</p>
        <div className="flex items-center text-gray-500 text-sm mt-2">
          <span>{video.views} views</span>
          <span className="mx-2">•</span>
          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}