'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Settings, Heart, Clock, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { auth, db } from "@/app/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  where,
} from "firebase/firestore";

export default function ProfilePage() {
  const [user, loading] = useAuthState(auth);
  const [likedVideos, setLikedVideos] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user's profile data
  useEffect(() => {
    if (!user) return;

    const fetchUserProfile = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Fetch user's liked videos
  useEffect(() => {
    if (!user) return;

    const videosRef = collection(db, "videos");
    // Remove the orderBy to avoid needing a composite index
    const q = query(
      videosRef,
      where("likes", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const videoData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date()
      }))
      // Sort the data client-side instead
      .sort((a, b) => b.createdAt - a.createdAt);
      
      setLikedVideos(videoData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);


  const LoadingSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-200" />
          <div className="flex-grow space-y-3">
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>
    </div>
  );

  if (!mounted || loading || isLoading) {
    return <LoadingSkeleton />;
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Please Login</h1>
          <p className="text-gray-600">You need to be logged in to view your profile</p>
        </div>
      </div>
    );
  }

  const formatTimeAgo = (date) => {
    const diffDays = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(diffDays, 'day');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 relative">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName || 'Profile'}
              width={96}
              height={96}
              className="rounded-full"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-4xl text-white font-medium">
                {(user.displayName || user.email || 'U')[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="flex-grow">
          <h1 className="text-2xl font-semibold mb-2">
            {user.displayName || 'User'}
          </h1>
          <p className="text-gray-600 text-sm mb-2">
            {userProfile?.bio || 'No bio added yet'}
          </p>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => auth.signOut()}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="liked" className="w-full">
        <TabsList className="border-b w-full justify-start rounded-none bg-transparent p-0 mb-6">
          <TabsTrigger 
            value="liked"
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 pb-2"
          >
            <Heart className="w-4 h-4 mr-2" />
            Liked Videos ({likedVideos.length})
          </TabsTrigger>
          <TabsTrigger 
            value="history"
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 pb-2"
          >
            <Clock className="w-4 h-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="liked" className="mt-0">
          {likedVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {likedVideos.map((video) => (
                <div key={video.id} className="rounded-lg overflow-hidden border">
                  <div className="aspect-video bg-gray-100 relative">
                    {video.thumbnailUrl && (
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                    )}
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 bg-black text-white text-xs px-1 rounded">
                        {video.duration}
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <h3 className="font-medium line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-gray-600">
                      {video.views?.toLocaleString() || 0} views • {formatTimeAgo(video.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No liked videos yet
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <div className="text-center py-8 text-gray-500">
            Your watch history will appear here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}