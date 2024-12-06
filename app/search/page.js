"use client";

import { useState, useEffect, Suspense } from "react";

import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/app/lib/firebase";

import Image from "next/image";

import { useSearchParams } from "next/navigation";

import { Settings, Battery, Calendar, X } from "lucide-react";

// Separate component for search content that uses useSearchParams

function SearchContent() {
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("q");

  const [videos, setVideos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState({
    carMakes: [],

    workTypes: [],

    systemCategories: [],
  });

  const [filters, setFilters] = useState({
    systemCategory: "",

    workType: "",

    carMake: "",

    carModel: "",
  });

  // Fetch categories

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryTypes = {
          carMakes: "car-makes",

          workTypes: "work-types",

          systemCategories: "system-categories",
        };

        const categoriesData = {};

        await Promise.all(
          Object.entries(categoryTypes).map(async ([key, path]) => {
            const itemsRef = collection(db, "categories", path, "items");

            const snapshot = await getDocs(itemsRef);

            categoriesData[key] = snapshot.docs.map((doc) => ({
              id: doc.id,

              ...doc.data(),
            }));
          })
        );

        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch videos based on search and filters

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);

      try {
        const videosRef = collection(db, "videos");

        let constraints = [];

        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            constraints.push(where(key, "==", value));
          }
        });

        if (searchQuery?.trim()) {
          const searchLower = searchQuery.toLowerCase();

          const q = query(videosRef, ...constraints);

          const snapshot = await getDocs(q);

          const videoData = snapshot.docs

            .map((doc) => ({
              id: doc.id,

              ...doc.data(),

              createdAt:
                doc.data().createdAt instanceof Timestamp
                  ? doc.data().createdAt.toDate()
                  : new Date(),
            }))

            .filter((video) => {
              const titleMatch = video.title
                ?.toLowerCase()
                .includes(searchLower);

              const makeMatch = video.carMake
                ?.toLowerCase()
                .includes(searchLower);

              const modelMatch = video.carModel
                ?.toLowerCase()
                .includes(searchLower);

              const categoryMatch = video.systemCategory
                ?.toLowerCase()
                .includes(searchLower);

              const workTypeMatch = video.workType
                ?.toLowerCase()
                .includes(searchLower);

              return (
                titleMatch ||
                makeMatch ||
                modelMatch ||
                categoryMatch ||
                workTypeMatch
              );
            })

            .sort((a, b) => b.createdAt - a.createdAt);

          setVideos(videoData);
        } else {
          const q = query(
            videosRef,
            ...constraints,
            orderBy("createdAt", "desc")
          );

          const snapshot = await getDocs(q);

          const videoData = snapshot.docs.map((doc) => ({
            id: doc.id,

            ...doc.data(),

            createdAt:
              doc.data().createdAt instanceof Timestamp
                ? doc.data().createdAt.toDate()
                : new Date(),
          }));

          setVideos(videoData);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchQuery, filters]);

  const FilterSection = ({ title, items, category }) => (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() =>
              setFilters((prev) => ({ ...prev, [category]: item.id }))
            }
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filters[category] === item.id
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <SearchSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-24">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-4">
          {searchQuery ? `Search Results for "${searchQuery}"` : "All Videos"}
        </h1>
        <p className="text-gray-600">
          {videos.length} {videos.length === 1 ? "result" : "results"} found
        </p>
      </div>

      {Object.values(filters).some((f) => f) && (
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;

            const category =
              categories[
                key === "systemCategory"
                  ? "systemCategories"
                  : key === "workType"
                  ? "workTypes"
                  : key === "carMake"
                  ? "carMakes"
                  : null
              ];

            const item = category?.find((item) => item.id === value);

            if (!item) return null;

            return (
              <div
                key={key}
                className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full"
              >
                <span className="text-sm text-blue-800">{item.name}</span>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, [key]: "" }))}
                  className="ml-1 text-blue-800 hover:text-blue-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.systemCategories.length > 0 && (
            <FilterSection
              title="System Categories"
              items={categories.systemCategories}
              category="systemCategory"
            />
          )}

          {categories.workTypes.length > 0 && (
            <FilterSection
              title="Work Types"
              items={categories.workTypes}
              category="workType"
            />
          )}

          {categories.carMakes.length > 0 && (
            <FilterSection
              title="Car Makes"
              items={categories.carMakes}
              category="carMake"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
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
                {video.views?.toLocaleString() || 0} views
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Separate loading skeleton component

function SearchSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-24">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-video bg-gray-200 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main export wrapped in Suspense

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}
