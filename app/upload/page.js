'use client';

import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');

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
      const [, , , videoId, hash] = url.split('/');
      return `https://player.vimeo.com/video/${videoId}?h=${hash}`;
    } catch (error) {
      return null;
    }
  };

  const getVimeoThumbnail = async (videoId, hash) => {
    try {
      const response = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}/${hash}`);
      if (!response.ok) {
        return 'https://picsum.photos/800/400';
      }
      const data = await response.json();
      return data.thumbnail_url || 'https://picsum.photos/800/400';
    } catch (error) {
      return 'https://picsum.photos/800/400';
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setVideoUrl(url);
    setError('');
    setSuccess('');

    if (url && !getVimeoEmbedUrl(url)) {
      setError('Please enter a valid Vimeo URL');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoUrl || !user || !isAdmin || !title) return;
  
    const [, , , videoId, hash] = videoUrl.split('/');
    const embedUrl = getVimeoEmbedUrl(videoUrl);
    if (!embedUrl) {
      setError('Please enter a valid Vimeo URL');
      return;
    }
  
    setIsLoading(true);
    setError('');
    setSuccess('');
  
    try {
      const thumbnailUrl = await getVimeoThumbnail(videoId, hash);
      await addDoc(collection(db, 'videos'), {
        title,
        url: videoUrl,
        embedUrl,
        userId: user.uid,
        thumbnailUrl,
        createdAt: new Date().toISOString(),
        platform: 'vimeo',
        views: 0,
        likes: []
      });
      
      setSuccess('Video added successfully!');
      setVideoUrl('');
      setTitle('');
    } catch (error) {
      console.error('Error adding video:', error);
      setError('Failed to add video');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) return null;

  const embedUrl = getVimeoEmbedUrl(videoUrl);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Upload Video</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Vimeo URL</Label>
              <Input
                id="videoUrl"
                type="url"
                value={videoUrl}
                onChange={handleUrlChange}
                placeholder="https://vimeo.com/123456789/abcdef123"
                required
              />
              <p className="text-sm text-muted-foreground">
                Paste the complete sharing URL from your Vimeo video
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 text-green-700 border-green-200">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
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

            <Button 
              type="submit"
              disabled={!embedUrl || !title || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Video...
                </>
              ) : (
                'Add Video'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}