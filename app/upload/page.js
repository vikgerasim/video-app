// app/upload/page.js
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

 const handleSubmit = async (e) => {
   e.preventDefault();
   if (!videoUrl || !user || !isAdmin) return;

   try {
     await addDoc(collection(db, 'videos'), {
       title,
       url: videoUrl,
       userId: user.uid,
       createdAt: new Date().toISOString()
     });
     
     alert('Video added successfully!');
     setVideoUrl('');
     setTitle('');
   } catch (error) {
     console.error('Error adding video:', error);
     alert('Failed to add video');
   }
 };

 if (!isAdmin) return null;

 return (
   <div className="max-w-2xl mx-auto p-4">
     <form onSubmit={handleSubmit} className="space-y-4">
       <div>
         <label className="block mb-2">Video URL</label>
         <input
           type="url"
           value={videoUrl}
           onChange={(e) => setVideoUrl(e.target.value)}
           className="w-full p-2 border rounded"
           placeholder="Enter video URL"
           required
         />
       </div>

       <div>
         <label className="block mb-2">Title</label>
         <input
           type="text"
           value={title}
           onChange={(e) => setTitle(e.target.value)}
           className="w-full p-2 border rounded"
           placeholder="Enter video title"
           required
         />
       </div>

       {videoUrl && (
         <div className="aspect-video">
           <video
             src={videoUrl}
             controls
             className="w-full h-full"
           />
         </div>
       )}

       <button 
         type="submit"
         className="w-full bg-blue-600 text-white p-2 rounded"
       >
         Upload Video
       </button>
     </form>
   </div>
 );
}