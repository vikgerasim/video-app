// app/video/[id]/page.js
import { db } from '@/app/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import VideoPlayer from './VideoPlayer';

export default async function VideoPage({ params }) {
  const { id } = params;
  
  const videoDoc = await getDoc(doc(db, 'videos', id));
  const rawVideo = videoDoc.exists() ? videoDoc.data() : null;

  if (!rawVideo) return <div>Video not found</div>;

  const { createdAt, ...rest } = rawVideo;
  const video = { ...rest, id }; // Include id in video object

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
      <VideoPlayer video={video} />
    </div>
  );
}