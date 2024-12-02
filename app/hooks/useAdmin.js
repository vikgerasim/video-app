// hooks/useAdmin.js
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    async function checkAdmin() {
      if (!user) return;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      setIsAdmin(docSnap.data()?.isAdmin || false);
    }
    checkAdmin();
  }, [user]);

  return isAdmin;
}