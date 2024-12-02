'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/app/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';

export default function Navbar() {
 const { user } = useAuth();
 const router = useRouter();
 const [isAdmin, setIsAdmin] = useState(false);
 const [searchQuery, setSearchQuery] = useState('');

 useEffect(() => {
   async function checkAdmin() {
     if (!user) return;
     const docRef = doc(db, 'users', user.uid);
     const docSnap = await getDoc(docRef);
     setIsAdmin(docSnap.data()?.isAdmin || false);
   }
   checkAdmin();
 }, [user]);

 const handleSignOut = async () => {
   try {
     await signOut(auth);
     router.push('/signin');
   } catch (error) {
     console.error('Error signing out:', error);
   }
 };

 const handleSearch = (e) => {
   e.preventDefault();
   if (searchQuery.trim()) {
     router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
   }
 };

 return (
   <nav className="bg-white shadow-md">
     <div className="container mx-auto px-4">
       <div className="flex justify-between items-center h-16">
         <Link href="/" className="text-xl font-bold">VG Automotive</Link>
         
         <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4">
           <input
             type="search"
             placeholder="Search videos..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-blue-500"
           />
         </form>

         <div className="flex items-center space-x-4">
           {user ? (
             <>
               {isAdmin && (
                 <Link href="/upload" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                   Upload
                 </Link>
               )}
               <Link href={`/profile/${user.uid}`} className="hover:text-gray-600">
                 Profile
               </Link>
               <button 
                 onClick={handleSignOut}
                 className="hover:text-gray-600"
               >
                 Sign Out
               </button>
             </>
           ) : (
             <Link href="/signin" className="hover:text-gray-600">
               Sign In
             </Link>
           )}
         </div>
       </div>
     </div>
   </nav>
 );
}