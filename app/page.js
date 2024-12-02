// src/app/page.js
"use client";

import VideoGrid from '@/app/components/video/VideoGrid'
import FeaturedVideo from '@/app/components/video/FeaturedVideo'
import { db } from '@/app/lib/firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { useEffect, useState } from 'react';

async function getVideos() {
  const q = query(collection(db, "videos"), orderBy("createdAt", "desc"), limit(12));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      const fetchedVideos = await getVideos();
      setVideos(fetchedVideos);
      setLoading(false);
    };

    fetchVideos();
  }, []);

  if (loading) return <div>Loading...</div>;

  const featuredVideos = videos.slice(0, 4);
  const remainingVideos = videos.slice(4);

  return (
    <div className="space-y-8">
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Featured Videos</h2>
        <FeaturedVideo videos={featuredVideos} />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">More Videos</h2>
        <VideoGrid videos={remainingVideos} />
      </div>
    </div>
  )
}