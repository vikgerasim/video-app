'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

const VideoCategories = ({ onFilterChange }) => {
  const [categories, setCategories] = useState({
    systemCategory: new Set(),
    workType: new Set(),
    yearRange: new Set(),
    carMake: new Set(),
    carModel: new Set()
  });
  
  const [selectedFilters, setSelectedFilters] = useState({
    systemCategory: '',
    workType: '',
    yearRange: '',
    carMake: '',
    carModel: ''
  });

  // Fetch unique categories from videos
  useEffect(() => {
    const videosRef = collection(db, 'videos');
    const q = query(videosRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
      const newCategories = {
        systemCategory: new Set(),
        workType: new Set(),
        yearRange: new Set(),
        carMake: new Set(),
        carModel: new Set()
      };

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.systemCategory) newCategories.systemCategory.add(data.systemCategory);
        if (data.workType) newCategories.workType.add(data.workType);
        if (data.yearRange) newCategories.yearRange.add(data.yearRange);
        if (data.carMake) newCategories.carMake.add(data.carMake);
        if (data.carModel) newCategories.carModel.add(data.carModel);
      });

      setCategories(newCategories);
    });
  }, []);

  const handleFilterChange = (category, value) => {
    const newFilters = {
      ...selectedFilters,
      [category]: value === selectedFilters[category] ? '' : value
    };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const categoryLabels = {
    systemCategory: 'System Category',
    workType: 'Work Type',
    yearRange: 'Year Range',
    carMake: 'Car Make',
    carModel: 'Car Model'
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Filter Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(categories).map(([categoryKey, values]) => (
          <div key={categoryKey} className="space-y-2">
            <h3 className="font-medium text-gray-700">{categoryLabels[categoryKey]}</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(values).map((value) => (
                <button
                  key={value}
                  onClick={() => handleFilterChange(categoryKey, value)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                    selectedFilters[categoryKey] === value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoCategories;