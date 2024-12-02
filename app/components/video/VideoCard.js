import Image from 'next/image';

export default function VideoCard({ video }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video">
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