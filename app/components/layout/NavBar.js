"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Home");

  useEffect(() => {
    async function checkAdmin() {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      setIsAdmin(docSnap.data()?.isAdmin || false);
    }
    checkAdmin();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="bg-white fixed top-0 left-0 right-0 z-40">
      <div className="relative flex w-full items-center rounded-full border p-2.5">
        <Link href="/" className="px-2">
          <Image
            src="/VG_Logo.png"
            alt="VG Automotive Logo"
            width={140}
            height={70}
            className="relative z-40"
          />
        </Link>

        <button
          onClick={() => {
            setActiveTab("Home");
            router.push("/");
          }}
          className={cn("relative z-[1] ml-12 px-4 py-2", {
            "z-0": activeTab === "Home",
          })}
        >
          {activeTab === "Home" && (
            <motion.div
              layoutId="active-tab"
              className="absolute inset-0 rounded-full bg-secondary"
              transition={{
                duration: 0.2,
                type: "spring",
                stiffness: 300,
                damping: 25,
                velocity: 2,
              }}
            />
          )}
          <span
            className={cn(
              "relative block text-sm font-medium transition-colors duration-200 hover:text-primary tracking-tight",
              activeTab === "Home" ? "text-primary" : "text-primary/60"
            )}
          >
            Home
          </span>
        </button>

        {user && (
          <button
            onClick={() => {
              setActiveTab("Profile");
              router.push(`/profile/${user.uid}`);
            }}
            className={cn("relative z-[1] px-4 py-2", {
              "z-0": activeTab === "Profile",
            })}
          >
            {activeTab === "Profile" && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 rounded-full bg-secondary"
                transition={{
                  duration: 0.2,
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  velocity: 2,
                }}
              />
            )}
            <span
              className={cn(
                "relative block text-sm font-medium transition-colors duration-200 hover:text-primary tracking-tight",
                activeTab === "Profile" ? "text-primary" : "text-primary/60"
              )}
            >
              Profile
            </span>
          </button>
        )}

        <form onSubmit={handleSearch} className="flex-1 mx-4">
          <input
            type="search"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1 rounded-full border focus:outline-none focus:border-blue-500 text-sm"
          />
        </form>

        {user && isAdmin && (
          <button
            onClick={() => {
              setActiveTab("Upload");
              router.push("/upload");
            }}
            className={cn("relative z-[1] px-4 py-2", {
              "z-0": activeTab === "Upload",
            })}
          >
            {activeTab === "Upload" && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 rounded-full bg-secondary"
                transition={{
                  duration: 0.2,
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  velocity: 2,
                }}
              />
            )}
            <span
              className={cn(
                "relative block text-sm font-medium transition-colors duration-200 hover:text-primary tracking-tight",
                activeTab === "Upload" ? "text-primary" : "text-primary/60"
              )}
            >
              Upload
            </span>
          </button>
        )}

        <div className="ml-auto">
          {user ? (
            <button
              onClick={handleSignOut}
              className="relative z-[1] px-4 py-2"
            >
              <span className="relative block text-sm font-medium transition-colors duration-200 hover:text-primary tracking-tight text-primary/60">
                Sign Out
              </span>
            </button>
          ) : (
            <Link href="/signin" className="relative z-[1] py-2">
              <span className="relative block text-sm font-medium transition-colors duration-200 hover:text-primary tracking-tight text-primary/60">
                Sign In
              </span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
