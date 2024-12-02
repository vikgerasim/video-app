'use client';
 
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
 
export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
 
  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        router.push('/signin');
        return;
      }
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      const isUserAdmin = docSnap.data()?.isAdmin || false;
      setIsAdmin(isUserAdmin);
     
      if (!isUserAdmin) {
        router.push('/');
      }
    }
    checkAdmin();
  }, [user, router]);
 
  const getVimeoEmbedUrl = (url) => {
    try {
      // Handle URLs with hash
      const match = url.match(/vimeo\.com\/(\d+)\/([a-zA-Z0-9]+)/);
      if (match && match[1] && match[2]) {
        return `https://player.vimeo.com/video/${match[1]}/${match[2]}`;
      }
      return null;
    } catch (error) {
      return null;
    }
  };
 
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setVideoUrl(url);
    setError('');
 
    if (url && !getVimeoEmbedUrl(url)) {
      setError('Please enter a valid Vimeo URL');
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoUrl || !user || !isAdmin || !title) return;
 
    const embedUrl = getVimeoEmbedUrl(videoUrl);
    if (!embedUrl) {
      setError('Please enter a valid Vimeo URL');
      return;
    }
 
    try {
      await addDoc(collection(db, 'videos'), {
        title,
        url: videoUrl,          // Store original URL
        embedUrl: embedUrl,     // Store embed URL
        userId: user.uid,
        thumbnailUrl: 'https://picsum.photos/800/400',
        createdAt: new Date().toISOString(),
        platform: 'vimeo'
      });
     
      alert('Video added successfully!');
      setVideoUrl('');
      setTitle('');
      setError('');
    } catch (error) {
      console.error('Error adding video:', error);
      setError('Failed to add video');
    }
  };
 
  if (!isAdmin) return null;
 
  const embedUrl = getVimeoEmbedUrl(videoUrl);
 
  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Vimeo URL</label>
          <input
            type="url"
            value={videoUrl}
            onChange={handleUrlChange}
            className="w-full p-2 border rounded"
            placeholder="Enter Vimeo URL with hash (e.g., https://vimeo.com/123456789/abcdef123)"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Paste the complete sharing URL from your Vimeo video
          </p>
        </div>
 
        <div>
          <label className="block mb-2 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter video title"
            required
          />
        </div>
 
        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
            {error}
          </div>
        )}
 
        {embedUrl && (
          <div style={{ padding: '74.84% 0 0 0', position: 'relative' }}>
            <iframe
              src={embedUrl}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              allowFullScreen
              title={title}
            />
          </div>
        )}
 
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          disabled={!embedUrl || !title}
        >
          Add Video
        </button>
      </form>
    </div>
  );
}