'use client';

import { useState } from 'react';
import Navbar from './NavBar';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function AppLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <div className="flex flex-col">
      <Navbar/>
      <div className="w-full">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main className={`transition-all duration-300 flex-grow mt-14 ${isCollapsed ? 'ml-24' : 'ml-48'}`}>
          {children}
          <Footer />
        </main>
      </div>
    </div>
  );
}