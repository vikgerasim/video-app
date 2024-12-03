'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Grid, User, Menu } from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Categories', icon: Grid, href: '/categories' },
    { name: 'You', icon: User, href: '/profile' },
  ];

  return (
    <div 
      className={`${
        isCollapsed ? 'w-24' : 'w-48'
      } h-screen bg-white border-r border-gray-200 fixed left-0 top-16 z-40 transition-all duration-300`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute right-0 -translate-x-1/2 -translate-y-1/2 top-6 bg-white border border-gray-200 rounded-full mt-2 p-2 hover:bg-gray-100"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex flex-col p-4 mt-12">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center ${
              isCollapsed ? 'justify-center' : 'space-x-3'
            } px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150`}
            title={isCollapsed ? item.name : ''}
          >
            <item.icon className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium">{item.name}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;