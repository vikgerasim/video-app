// app/video/[id]/page.js
import { db } from '@/app/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import VideoPlayer from './VideoPlayer';

export default async function VideoPage({ params }) {
  const id = await params.id;
  const videoDoc = await getDoc(doc(db, 'videos', id));
  const rawVideo = videoDoc.exists() ? videoDoc.data() : null;

  if (!rawVideo) return <div>Video not found</div>;

  // Remove timestamp fields for serialization
  const { createdAt, ...rest } = rawVideo;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <VideoPlayer video={rest} />
      <h1 className="text-2xl font-bold mb-2">{rest.title}</h1>
    </div>
  );
}