'use client';

import { useState } from 'react';
import Navbar from './NavBar';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function AppLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main className={`flex-1 flex flex-col transition-all duration-300 mt-14 ${
          isCollapsed ? 'ml-24' : 'ml-48'
        }`}>
          <div className="flex-1 mb-4">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}