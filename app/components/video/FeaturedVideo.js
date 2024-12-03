'use client';

import { Play } from "lucide-react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function FeaturedVideo({ videos }) {
  const router = useRouter();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {videos.map((video) => (
        <div key={video.id} className="relative">
          <div 
            className="relative cursor-pointer group rounded-lg overflow-hidden"
            onClick={() => router.push(`/video/${video.id}`)}
          >
            <div className="relative aspect-video w-full">
              <Image 
                src={video.thumbnailUrl}
                alt={video.title}
                fill
                className="w-full transition-all duration-200 group-hover:brightness-[0.8] ease-out"
              />
              <div className="absolute inset-0 flex items-center justify-center group-hover:scale-100 scale-[0.9] transition-all duration-200 ease-out">
                <div className="bg-primary/10 flex items-center justify-center rounded-full backdrop-blur-md size-16">
                  <div className="flex items-center justify-center bg-gradient-to-b from-primary/30 to-primary shadow-md rounded-full size-12 transition-all ease-out duration-200 relative group-hover:scale-[1.2] scale-100">
                    <Play className="size-6 text-white fill-white group-hover:scale-105 scale-100 transition-transform duration-200 ease-out" />
                  </div>
                </div>
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
        </div>
      ))}
    </div>
  );
}