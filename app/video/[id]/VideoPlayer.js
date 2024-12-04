"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { auth, db } from "@/app/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const VideoPlayer = ({ video }) => {
  const [user] = useAuthState(auth);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes?.length || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const videoId = video.id;

  useEffect(() => {
    if (!videoId) return;
  
    const videoRef = doc(db, "videos", videoId);
    return onSnapshot(videoRef, (doc) => {
      const videoData = doc.data();
      if (!videoData) return;
      
      setIsLiked(user && videoData.likes ? videoData.likes.includes(user.uid) : false);
      setLikeCount(videoData.likes?.length || 0);
    });
  }, [videoId, user]);
  // Add separate effect for view increment
  useEffect(() => {
    if (!videoId) return;

    const incrementViews = async () => {
      const videoRef = doc(db, "videos", videoId);
      await updateDoc(videoRef, {
        views: increment(1),
      });
    };

    // Only increment view on initial load
    incrementViews();
  }, [videoId]);

  useEffect(() => {
    if (!videoId) return;

    const commentsRef = collection(db, "videos", videoId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "desc"));

    return onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(comments);
    });
  }, [videoId]);

  const handleLike = async () => {
    if (!user || !videoId) return;
  
    const videoRef = doc(db, "videos", videoId);
    await updateDoc(videoRef, {
      likes: isLiked ? [] : [user.uid]
    });
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim() || !videoId) return;

    try {
      setIsSubmitting(true);
      await addDoc(collection(db, "videos", videoId, "comments"), {
        text: newComment,
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
        createdAt: new Date(),
      });
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      setError("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEmbedUrl = (url) => {
    const [, , , videoId, hash] = url.split("/");
    return `https://player.vimeo.com/video/${videoId}?h=${hash}`;
  };

  return (
    <div className="space-y-4">
      <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
        <iframe
          src={getEmbedUrl(video.url)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleLike}
          disabled={!user}
          className={`px-4 py-2 rounded ${
            isLiked ? "bg-blue-500" : "bg-gray-200"
          }`}
        >
          {likeCount} Likes
        </button>
        <span>{video.views || 0} views</span>
      </div>

      {user ? (
        <form onSubmit={handleComment} className="space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Add a comment..."
            disabled={isSubmitting}
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {isSubmitting ? "Posting..." : "Comment"}
          </button>
        </form>
      ) : (
        <p>Please login to like and comment</p>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-2">
            <div className="flex items-center gap-2">
              <Image
                src={comment.userPhoto}
                alt={comment.userName}
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="font-bold">{comment.userName}</span>
            </div>
            <p>{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
