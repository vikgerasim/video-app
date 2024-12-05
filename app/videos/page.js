'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '@/app/lib/firebase';
import VideoGrid from '@/app/components/video/VideoGrid';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function VideosPage() {
  const [user] = useAuthState(auth);
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    systemCategory: [],
    workType: [],
    yearRange: [],
    carMake: [],
    carModel: []
  });
  
  const [categoryFilters, setCategoryFilters] = useState({
    systemCategory: '',
    workType: '',
    yearRange: '',
    carMake: '',
    carModel: ''
  });

  // Fetch videos and filter options
  useEffect(() => {
    const videosRef = collection(db, 'videos');
    const q = query(videosRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const videoData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.().toISOString() || new Date().toISOString(),
      }));
      
      setVideos(videoData);
      
      const options = {
        systemCategory: [...new Set(videoData.map(video => video.systemCategory).filter(Boolean))],
        workType: [...new Set(videoData.map(video => video.workType).filter(Boolean))],
        yearRange: [...new Set(videoData.map(video => video.yearRange).filter(Boolean))],
        carMake: [...new Set(videoData.map(video => video.carMake).filter(Boolean))],
        carModel: [...new Set(videoData.map(video => video.carModel).filter(Boolean))]
      };
      
      setFilterOptions(options);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...videos];
    Object.entries(categoryFilters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(video => video[key] === value);
      }
    });
    setFilteredVideos(result);
  }, [videos, categoryFilters]);

  const handleFilterClick = (category, value) => {
    setCategoryFilters(prev => ({
      ...prev,
      [category]: prev[category] === value ? '' : value
    }));
  };

  const CollapsedFilters = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Filter Videos</h2>
        <button onClick={() => setIsExpanded(true)} className="p-1">
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-5 gap-8">
        <div>
          <h3 className="text-sm text-gray-600 mb-2">System Category</h3>
          <div className="flex flex-wrap gap-2">
            {filterOptions.systemCategory.slice(0, 2).map(value => (
              <button
                key={value}
                onClick={() => handleFilterClick('systemCategory', value)}
                className={`px-3 py-1 text-sm rounded-full ${
                  categoryFilters.systemCategory === value 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm text-gray-600 mb-2">Work Type</h3>
          <div className="flex flex-wrap gap-2">
            {filterOptions.workType.slice(0, 3).map(value => (
              <button
                key={value}
                onClick={() => handleFilterClick('workType', value)}
                className={`px-3 py-1 text-sm rounded-full ${
                  categoryFilters.workType === value 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm text-gray-600 mb-2">Year Range</h3>
          <div className="flex flex-wrap gap-2">
            {filterOptions.yearRange.slice(0, 2).map(value => (
              <button
                key={value}
                onClick={() => handleFilterClick('yearRange', value)}
                className={`px-3 py-1 text-sm rounded-full ${
                  categoryFilters.yearRange === value 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm text-gray-600 mb-2">Car Make</h3>
          <div className="flex flex-wrap gap-2">
            {filterOptions.carMake.slice(0, 2).map(value => (
              <button
                key={value}
                onClick={() => handleFilterClick('carMake', value)}
                className={`px-3 py-1 text-sm rounded-full ${
                  categoryFilters.carMake === value 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm text-gray-600 mb-2">Car Model</h3>
          <div className="flex flex-wrap gap-2">
            {filterOptions.carModel.slice(0, 1).map(value => (
              <button
                key={value}
                onClick={() => handleFilterClick('carModel', value)}
                className={`px-3 py-1 text-sm rounded-full ${
                  categoryFilters.carModel === value 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ExpandedFilters = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Filter Videos</h2>
        <button onClick={() => setIsExpanded(false)} className="p-1">
          <ChevronUp className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm text-gray-600 mb-2">System Category</h3>
            <div className="flex flex-wrap gap-2">
              {filterOptions.systemCategory.map(value => (
                <button
                  key={value}
                  onClick={() => handleFilterClick('systemCategory', value)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    categoryFilters.systemCategory === value 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm text-gray-600 mb-2">Work Type</h3>
            <div className="flex flex-wrap gap-2">
              {filterOptions.workType.map(value => (
                <button
                  key={value}
                  onClick={() => handleFilterClick('workType', value)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    categoryFilters.workType === value 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-sm text-gray-600 mb-2">Year Range</h3>
          <div className="flex flex-wrap gap-2">
            {filterOptions.yearRange.map(value => (
              <button
                key={value}
                onClick={() => handleFilterClick('yearRange', value)}
                className={`px-3 py-1 text-sm rounded-full ${
                  categoryFilters.yearRange === value 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm text-gray-600 mb-2">Car Make</h3>
            <div className="flex flex-wrap gap-2">
              {filterOptions.carMake.map(value => (
                <button
                  key={value}
                  onClick={() => handleFilterClick('carMake', value)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    categoryFilters.carMake === value 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm text-gray-600 mb-2">Car Model</h3>
            <div className="flex flex-wrap gap-2">
              {filterOptions.carModel.map(value => (
                <button
                  key={value}
                  onClick={() => handleFilterClick('carModel', value)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    categoryFilters.carModel === value 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 aspect-video rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        {isExpanded ? <ExpandedFilters /> : <CollapsedFilters />}
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-6">
          {filteredVideos.length} {filteredVideos.length === 1 ? 'Video' : 'Videos'} Found
        </h2>
        <VideoGrid videos={filteredVideos} />
      </section>
    </div>
  );
}