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
  deleteDoc,
  where,
} from "firebase/firestore";
import {
  Heart,
  MessageCircle,
  Trash2,
  Settings,
  Battery,
  Calendar,
} from "lucide-react";

const UserAvatar = ({ user, comment }) => {
  const isGoogleUser = comment.isGoogleUser;

  if (isGoogleUser) {
    return (
      <Image
        src={comment.userPhoto || "/default-avatar.png"}
        alt={comment.userName}
        width={40}
        height={40}
        className="rounded-full"
      />
    );
  }

  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white">
      <span className="text-lg font-medium">U</span>
    </div>
  );
};

const VideoPlayer = ({ video }) => {
  const [user] = useAuthState(auth);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video?.likes?.length || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showComments, setShowComments] = useState(true);
  const videoId = video?.id;

  useEffect(() => {
    if (!videoId) return;

    const videoRef = doc(db, "videos", videoId);
    return onSnapshot(videoRef, (doc) => {
      const videoData = doc.data();
      if (!videoData) return;

      setIsLiked(
        user && videoData.likes ? videoData.likes.includes(user.uid) : false
      );
      setLikeCount(videoData.likes?.length || 0);
    });
  }, [videoId, user]);

  useEffect(() => {
    if (!videoId || !user) return; // Only increment if user is logged in
    const incrementViews = async () => {
      try {
        const videoRef = doc(db, "videos", videoId);
        await updateDoc(videoRef, {
          views: increment(1),
        });
      } catch (error) {
        console.error("Error incrementing views:", error);
      }
    };
    incrementViews();
  }, [videoId, user]);

  useEffect(() => {
    if (!videoId) return;
    const commentsRef = collection(db, "comments");
    const q = query(
      commentsRef,
      where("videoId", "==", videoId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      }));
      setComments(comments);
    });
  }, [videoId]);

  const handleLike = async () => {
    if (!user || !videoId) return;
    try {
      const videoRef = doc(db, "videos", videoId);
      await updateDoc(videoRef, {
        likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
      });
    } catch (error) {
      console.error("Error updating likes:", error);
      setError("Failed to update like. Please try again.");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim() || !videoId) return;

    try {
      setIsSubmitting(true);
      setError("");

      const isGoogleUser = user.providerData[0]?.providerId === "google.com";
      const userName = isGoogleUser
        ? user.displayName || "Anonymous"
        : `user${user.uid.slice(0, 8)}`;

      await addDoc(collection(db, "comments"), {
        text: newComment,
        videoId,
        userId: user.uid,
        userName,
        isGoogleUser,
        userPhoto: isGoogleUser ? user.photoURL : null,
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

  const handleDeleteComment = async (commentId) => {
    if (!user || !commentId) return;
    try {
      const commentRef = doc(db, "comments", commentId);
      await deleteDoc(commentRef);
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Failed to delete comment. Please try again.");
    }
  };

  const formatDate = (date) => {
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24)),
      "day"
    );
  };

  if (!video) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">Video not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Video Info Section */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
            <Settings className="w-4 h-4" />
            <span className="text-sm">{video.categories?.systemCategory}</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
            <Battery className="w-4 h-4" />
            <span className="text-sm">{video.categories?.workType}</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{video.categories?.yearRange}</span>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative aspect-video bg-black">
        <iframe
          src={video.videoUrl}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Interaction Buttons */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            disabled={!user}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              isLiked
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            <span>{likeCount}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{comments.length}</span>
          </button>
        </div>
        <div className="text-gray-500">
          {video.views?.toLocaleString() || 0} views
        </div>
      </div>

      {/* Vehicle Information */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h2 className="font-semibold mb-2">Vehicle Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <span className="text-gray-500">Make:</span>
            <p className="font-medium capitalize">{video.carMake}</p>
          </div>
          <div>
            <span className="text-gray-500">Model:</span>
            <p className="font-medium">{video.carModel}</p>
          </div>
          <div>
            <span className="text-gray-500">Year Range:</span>
            <p className="font-medium">{video.yearRange}</p>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-4">
          {/* Comments List */}
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">
              Comments ({comments.length})
            </h2>

            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex gap-3 p-4 rounded-lg hover:bg-gray-50"
                >
                  <UserAvatar user={user} comment={comment} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.userName}</span>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      {user?.uid === comment.userId && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="mt-1 text-gray-700">{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No comments yet</p>
            )}
          </div>

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleComment} className="space-y-2 border-t pt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a comment..."
                rows={3}
                disabled={isSubmitting}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Posting..." : "Comment"}
                </button>
              </div>
            </form>
          ) : (
            <div className="border-t pt-4">
              <a
                href="/signin"
                className="block w-full p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center"
              >
                Sign in to like and comment
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
