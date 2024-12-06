'use client';
import { Suspense } from 'react';
import VideoGrid from "@/app/components/video/VideoGrid";
import FeaturedVideo from "@/app/components/video/FeaturedVideo";
import { Hero } from "@/app/components/layout/Hero";
import { db } from "@/app/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { useEffect, useState } from "react";

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

function Content({ videos }) {
  const featuredVideos = videos.slice(0, 4);
  const remainingVideos = videos.slice(4);

  return (
    <div className="-mt-16">
      <div className="flex justify-center w-full -ml-32">
        <Hero />
      </div>
      <div className="px-4 lg:px-16 space-y-8">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Featured Videos</h2>
          <FeaturedVideo videos={featuredVideos} />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">More Videos</h2>
          <VideoGrid videos={remainingVideos} />
        </div>
      </div>
    </div>
  );
}

function VideoContent() {
  const [videos, setVideos] = useState([]);
  
  useEffect(() => {
    const fetchVideos = async () => {
      const q = query(
        collection(db, "videos"),
        orderBy("createdAt", "desc"),
        limit(12)
      );
      const querySnapshot = await getDocs(q);
      const fetchedVideos = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setVideos(fetchedVideos);
    };

    fetchVideos();
  }, []);

  if (videos.length === 0) {
    return <LoadingState />;
  }

  return <Content videos={videos} />;
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingState />}>
      <VideoContent />
    </Suspense>
  );
}